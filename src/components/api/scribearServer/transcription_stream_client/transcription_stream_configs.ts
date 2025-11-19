import Type from "typebox";

const DebugProviderConfigSchema = Type.Object({
  sample_rate: Type.Integer(),
  num_channels: Type.Integer(),
});

type DebugProviderConfig = Type.Static<typeof DebugProviderConfigSchema>;

type TranscriptionStreamConfig = DebugProviderConfig;

export { DebugProviderConfigSchema };
export type { DebugProviderConfig, TranscriptionStreamConfig };
