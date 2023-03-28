export default function isMetaKey(event: React.KeyboardEvent) {
  return event.metaKey || event.getModifierState('Meta') || event.getModifierState('OS');
}
