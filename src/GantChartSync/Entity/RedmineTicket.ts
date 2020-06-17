import {Status} from "./Status";
import {Priority} from "./Priority";
import {Author} from "./Author";
import {Tracker} from "./Tracker";

export class RedmineTicket {
  public id: string;
  public tracker: Tracker;
  public status: Status;
  public priority: Priority;
  public author: Author;
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

  public createRedmineChicketFromRequest(request: any) {
    this.id = ticketId === undefined ? null : request.ticketId;
    this.tracker = tracker === undefined ? null : request.tracker;
    this.status = status === undefined ? null : request.status;
    this.priority = priority === undefined ? null : request.priority;
    this.author = author === undefined ? null : request.author;
    this.subject = subject === undefined ? null : request.subject;
    this.description = description === undefined ? null : request.description;
    this.startDate = startDate === undefined ? null : request.startDate;
    this.dueDate = dueDate === undefined ? null : dueDate;
    this.doneRatio = doneRatio === undefined ? null : request.doneRatio;
    this.isPrivate = isPrivate === undefined ? null : request.isPrivate;
    this.estimatedHours = estimatedHours === undefined ? null : request.estimatedHours;
    this.createdOn = createdOn === undefined ? null : request.createdOn;
    this.updatedOn = updatedOn === undefined ? null : request.updatedOn;
    this.closedOn = closedOn === undefined ? null : request.closedOn;    
  }
}
