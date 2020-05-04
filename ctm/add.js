/**
 * ツール追加用バッチ
 * webpack用jsonにツール名とエントリポイントを追加し、
 * src配下にツール名のフォルダとエントリポイントのjs or tsファイルを設置する.
 * @author elty 
 */

const path = require('path');
const fs = require('fs');


/**
 * printErrorMessages - エラー出力
 *
 * @param  {string[]} errorMessages エラー出力内容
 * @return {void}               返り値なし
 */
function printErrorMessages(errorMessages) {
  if (errorMessages.length > 0) {
    for (let i = 0; i < errorMessages.length; i++) {
      console.error(errorMessages[i]);
    }
  }
}

/**
 * getAppList - 登録しているアプリ一覧を取得する.
 *
 * @return {object}  アプリ一覧(key: アプリ名, value: エントリーポイント)
 */
function getAppList() {
  const filePathStr = path.resolve(__dirname, 'resources', 'app.json');
  try {
    const toolList = JSON.parse(
      fs.readFileSync(
        filePathStr,
        'utf8'
      )
    );
    return toolList;
  } catch(e) {
    throw new Error(
      "ツール一覧の取得に失敗しました。ファイルパス：" +
      filePathStr
    );
  }
}


/**
 * setNewApp - ツール登録処理&エントリポイント作成
 *
 * @param  {object} list 全ツール情報
 * @param  {string} toolName 新ツール名
 * @param  {string} toolEntryPointFileName 新ツールのエントリポイントのファイル名
 * @return {void}      返り値なし。
 */
function setNewApp(list, toolName, toolEntryPointFileName) {
  fs.writeFileSync(
    path.resolve(__dirname, 'resources', 'app.json'),
    JSON.stringify(list),
    (err) => {
      // 書き出しに失敗した場合
      if(err){
        console.error("エラーが発生しました。" + err)
        throw err
      }
    }
  );

  fs.mkdirSync(path.resolve(__dirname, '../src', toolName), (err) => {
      if (err) { throw err; }
  });

  fs.copyFileSync(
    path.resolve(__dirname, 'defaultEntryPoint.js'),
    path.resolve(__dirname, '../src', toolName, toolEntryPointFileName),
    fs.constants.COPYFILE_EXCL,
    (err) => {
      if (err) {
          console.log(err.stack);
      }
      else {
          console.log('Done.');
      }
  });
}

/**
 * readUserInput - ユーザからのキーボード入力を取得する Promise を生成する
 *
 * @param  {string} question 入力時にコマンドラインに表示する文言
 * @return {string}          入力した文字列
 */
function readUserInput(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    readline.question(question, (answer) => {
      resolve(answer);
      readline.close();
    });
  });
}


/**
 * validateToolName - ツール名入力値チェック
 *
 * @param  {object} list ツール一覧
 * @param  {string} name 入力されたツール名
 * @return {string[]}    エラー文言
 */
function validateToolName(list, name) {
  const res = [];
  if (name.length < 1) {
    res.push("ツール名は必ず入力してください.");
  }
  for (tool in list) {
    if (tool === name) {
      res.push("ツール名が重複しています。");
    }
  }
  const fileNameStr = name.match(/^[A-Za-z0-9]*$/);
  if (fileNameStr === null) {
    res.push("ツール名には半角英数字を指定してください。");
  }
  if (name[0].match(/^[0-9]*$/) !== null) {
    res.push("ツール名は半角英字から開始してください。");
  }
  return res;
}

/**
 * validateTsFlag - typescriptフラグ入力値チェック
 *
 * @param  {object} list ツール一覧
 * @param  {string} flag 入力されたフラグ文字列
 * @return {string[]}    エラー文言
 */
function validateTsFlag(flag) {
  const res = [];
  if (flag !== "Y" && flag !== "N" && flag !== "") {
    res.push("YかNで入力してください。");
  }
  return res;
}

/**
 * validateEntryPointName - ツールエントリポイント入力値チェック
 *
 * @param  {object} list ツール一覧
 * @param  {string} name 入力されたエントリポイント名
 * @return {string[]}    エラー文言
 */
function validateEntryPointName(name) {
  const res = [];
  if (name.length < 1) {
    return res;
  }

  const fileNameStr = name.match(/^[A-Za-z0-9]*$/);
  if (fileNameStr === null) {
    res.push("エントリーポイントには半角英数字を指定してください。");
  }
  if (name[0].match(/^[0-9]*$/) !== null) {
    res.push("エントリーポイントは半角英字から開始してください。");
  }
  return res;
}

/**
 * main - メイン処理
 *
 * @return {int}  0:正常終了,1:異常終了
 */
(async function main() {
  const list = getAppList();

  const name = await readUserInput(
    'ツール名を入力してください.(半角英数字.数字開始は不可) \n' +
    ':'
  );
  let errorMessages = validateToolName(list, name);
  if (errorMessages.length > 0) {
    printErrorMessages(errorMessages);
    return -1;
  }

  let useTs = await readUserInput(
    'typescriptを使用しますか？[Y/N] (default: Y) \n' +
    ':'
  );
  errorMessages = validateTsFlag(useTs);
  if (errorMessages.length > 0) {
    printErrorMessages(errorMessages);
    return -1;
  }
  useTs = useTs.length < 1 ? "Y" : useTs;

  let entryPointName = await readUserInput(
    'エントリーポイントのファイル名を入力してください(拡張子なし) \n' +
    '(default: index) \n' +
    ':'
  );
  errorMessages = validateEntryPointName(entryPointName);
  if (errorMessages.length > 0) {
    printErrorMessages(errorMessages);
    return -1;
  }
  entryPointName = entryPointName.length < 1 ? "index" : entryPointName;
  entryPointName += useTs === "Y" ? ".ts" : ".js";

  let confirm = await readUserInput(
    'ツール名: ' + name + "\n" +
    'typescriptを使用するか: ' + useTs + "\n" +
    'エントリーポイント名: ' + entryPointName + "\n" +
    '以上でよろしいですか？[Nなら終了] \n' +
    ':'
  );
  if (confirm === "N") {
    console.log("終了します。");
    return 0;
  }
  const filePath = "./src/" + name + "/" + entryPointName;
  list[name] = filePath;

  setNewApp(list, name, entryPointName);
  console.log("登録が完了しました。\n エントリポイント: " + filePath);

  return 0;
})();