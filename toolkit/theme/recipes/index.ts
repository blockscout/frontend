import { recipe as alert } from './alert.recipe';
import { recipe as badge } from './badge.recipe';
import { recipe as button } from './button.recipe';
import { recipe as closeButton } from './close-button.recipe';
import { recipe as dialog } from './dialog.recipe';
import { recipe as drawer } from './drawer.recipe';
import { recipe as field } from './field.recipe';
import { recipe as input } from './input.recipe';
import { recipe as link } from './link.recipe';
import { recipe as nativeSelect } from './native-select.recipe';
import { recipe as pinInput } from './pin-input.recipe';
import { recipe as popover } from './popover.recipe';
import { recipe as progressCircle } from './progress-circle.recipe';
import { recipe as select } from './select.recipe';
import { recipe as skeleton } from './skeleton.recipe';
import { recipe as spinner } from './spinner.recipe';
import { recipe as switchRecipe } from './switch.recipe';
import { recipe as table } from './table.recipe';
import { recipe as tabs } from './tabs.recipe';
import { recipe as tag } from './tag.recipe';
import { recipe as textarea } from './textarea.recipe';
import { recipe as toast } from './toast.recipe';
import { recipe as tooltip } from './tooltip.recipe';

export const recipes = {
  badge,
  button,
  closeButton,
  input,
  link,
  skeleton,
  spinner,
  textarea,
};

export const slotRecipes = {
  alert,
  dialog,
  drawer,
  field,
  nativeSelect,
  pinInput,
  popover,
  progressCircle,
  select,
  'switch': switchRecipe,
  table,
  tabs,
  tag,
  toast,
  tooltip,
};
