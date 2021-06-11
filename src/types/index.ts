import { Request } from "express";
import { Model, Document } from "mongoose";
import Override from "./tools";

export interface IAccommodation extends Document {
  id?: string;
  name: string;
  description: string;
  maxGuests: number;
  city: string;
}

export interface IUser extends Document {
  _id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  refreshToken: string;
  googleId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: string;
}

export interface IUserPrivate extends IUser {
  password: string;
}

export type AuthorizedRequest<T> = Request<
  {},
  {},
  T & { user: IUserPrivateDocument }
>;

export type IUserPrivateDocument = IUserPrivate & Document;

export interface UserModel extends Model<IUserPrivateDocument> {
  // Here you can add static methods to our Model
  checkCredentials: (
    email: string,
    pw: string
  ) => Promise<IUserPrivateDocument | null>;
}

export type JWKS = {
  keys: JWK[];
};

export type JWK = {
  alg: string;
  kty: string;
  use: string;
  n: string;
  e: string;
  kid: string;
  x5t: string;
  x5c: string[];
};

export interface Session {
  id: number;
  dateCreated: number;
  username: string;
  /**
   * Timestamp indicating when the session was created, in Unix milliseconds.
   */
  issued: number;
  /**
   * Timestamp indicating when the session should expire, in Unix milliseconds.
   */ 
  expires: number;
}

/**
* Identical to the Session type, but without the `issued` and `expires` properties.
*/
export type PartialSession = Omit<Session, "issued" | "expires">;

export interface EncodeResult {
  token: string,
  expires: number,
  issued: number
}

export type DecodeResult =
    | {
          type: "valid";
          session: Session;
      }
    | {
          type: "integrity-error";
      }
    | {
          type: "invalid-token";
      };