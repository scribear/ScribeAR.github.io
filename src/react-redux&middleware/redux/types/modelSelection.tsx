export type ModelOptions = Array<{
  model_key: string;
  display_name: string;
  description: string;
  available_features: string;
}>;

export type SelectedOption = {
  model_key: string;
  display_name: string;
  description: string;
  available_features: string;
} | null;

export type ModelSelection = {
  options: ModelOptions,
  selected: SelectedOption
};
