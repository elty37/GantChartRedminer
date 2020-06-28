import {Status} from "./Status";
import {Priority} from "./Priority";
import {Author} from "./Author";
import {Tracker} from "./Tracker";
import {Parent} from "./Parent";

export class RedmineTicket {
  public id: string;
  public tracker: Tracker;
  public status: Status;
  public priority: Priority;
  public author: Author;
  public parent: Parent;
  public subject: string;
  public description: string;
  public startDate: string;
  public dueDate: string;
  public doneRatio: string;
  public isPrivate: boolean;
  public estimatedHours: string;
  public createdOn: string;
  public updatedOn: string;
  public closedOn:string;

  constructor(
      ticketId?: string,
      tracker?: Tracker,
      status?: Status,
      priority?: Priority,
      author?: Author,
      parent?: Parent,
      subject?: string,
      description?: string,
      startDate?: string,
      dueDate?: string,
      doneRatio?: string,
      isPrivate?: boolean,
      estimatedHours?: string,
      createdOn?: string,
      updatedOn?: string,
      closedOn?:string
  ) {
    this.id = ticketId === undefined ? null : ticketId;
    this.tracker = tracker === undefined ? null : tracker;
    this.status = status === undefined ? null : status;
    this.priority = priority === undefined ? null : priority;
    this.author = author === undefined ? null : author;
    this.parent = parent === undefined ? null : parent;
    this.subject = subject === undefined ? null : subject;
    this.description = description === undefined ? null : description;
    this.startDate = startDate === undefined ? null : startDate;
    this.dueDate = dueDate === undefined ? null : dueDate;
    this.doneRatio = doneRatio === undefined ? null : doneRatio;
    this.isPrivate = isPrivate === undefined ? null : isPrivate;
    this.estimatedHours = estimatedHours === undefined ? null : estimatedHours;
    this.createdOn = createdOn === undefined ? null : createdOn;
    this.updatedOn = updatedOn === undefined ? null : updatedOn;
    this.closedOn = closedOn === undefined ? null : closedOn;
  }

  /**
   * リクエストから、オブジェクトを生成する
   * @param {Object} request
   */
  public createRedmineTicketFromRequest(request: any) {
    this.id = request.id === undefined ? null : request.id;
    this.tracker = request.tracker === undefined ? null : request.tracker;
    this.status = request.status === undefined ? null : request.status;
    this.priority = request.priority === undefined ? null : request.priority;
    this.author = request.author === undefined ? null : request.author;
    this.parent = request.parent === undefined ? null : request.parent;
    this.subject = request.subject === undefined ? null : request.subject;
    this.description = request.description === undefined ? null : request.description;
    this.startDate = request.start_date === undefined ? null : request.start_date;
    this.dueDate = request.due_date === undefined ? null : request.due_date;
    this.doneRatio = request.done_ratio === undefined ? null : request.done_ratio;
    this.isPrivate = request.is_private === undefined ? null : request.is_private;
    this.estimatedHours = request.estimated_hours === undefined ? null : request.estimated_hours;
    this.createdOn = request.created_on === undefined ? null : request.created_on;
    this.updatedOn = request.updated_on === undefined ? null : request.updated_on;
    this.closedOn = request.closed_on === undefined ? null : request.closed_on;
  }
}
