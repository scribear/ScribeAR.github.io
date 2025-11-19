import Type from 'typebox';

enum ClientMessageTypes {
  AUTH = 'auth',
  CONFIG = 'config',
}

const AuthMessageSchema = Type.Object({
  type: Type.Literal(ClientMessageTypes.AUTH),
  api_key: Type.String(),
});
type AuthMessage = Type.Static<typeof AuthMessageSchema>;

const ConfigMessageSchema = Type.Object({
  type: Type.Literal(ClientMessageTypes.CONFIG),
  config: Type.Any(),
});
type ConfigMessage = Type.Static<typeof ConfigMessageSchema>;

export { ClientMessageTypes, AuthMessageSchema, ConfigMessageSchema };
export type { AuthMessage, ConfigMessage };
