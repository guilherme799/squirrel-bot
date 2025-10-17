declare interface CommandConfig {
  name: string;
  variations: Array<string>;
}

export interface ContextConfig {
  name: string;
  isPublic: boolean;
  onlyOwner: boolean;
  icon: string;
  commands: Array<CommandConfig>;
}
