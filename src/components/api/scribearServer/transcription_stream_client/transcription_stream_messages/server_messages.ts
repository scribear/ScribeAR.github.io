import Type from "typebox";
import { Validator } from "typebox/compile";

enum ServerMessageTypes {
  IP_TRANSCRIPT = "ip_transcript",
  FINAL_TRANSCRIPT = "final_transcript",
}

const IPTranscriptMessageSchema = Type.Object({
  type: Type.Literal(ServerMessageTypes.IP_TRANSCRIPT),
  text: Type.Array(Type.String()),
  starts: Type.Union([Type.Array(Type.Number()), Type.Null()]),
  ends: Type.Union([Type.Array(Type.Number()), Type.Null()]),
});
type IPTranscriptMessage = Type.Static<typeof IPTranscriptMessageSchema>;

const FinalTranscriptMessageSchema = Type.Object({
  type: Type.Literal(ServerMessageTypes.FINAL_TRANSCRIPT),
  text: Type.Array(Type.String()),
  starts: Type.Union([Type.Array(Type.Number()), Type.Null()]),
  ends: Type.Union([Type.Array(Type.Number()), Type.Null()]),
});
type FinalTranscriptMessage = Type.Static<typeof FinalTranscriptMessageSchema>;

const ServerMessageValidator = new Validator(
  {},
  Type.Union([IPTranscriptMessageSchema, FinalTranscriptMessageSchema])
);

export {
  ServerMessageTypes,
  IPTranscriptMessageSchema,
  FinalTranscriptMessageSchema,
  ServerMessageValidator,
};
export type { IPTranscriptMessage, FinalTranscriptMessage };
