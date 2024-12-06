export interface SelectOption<Value extends string = string> {
  value: Value | undefined;
  label: string;
}
