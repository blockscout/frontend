import { recipe as alert } from './alert.recipe';
import { recipe as button } from './button.recipe';
import { recipe as closeButton } from './close-button.recipe';
import { recipe as dialog } from './dialog.recipe';
import { recipe as field } from './field.recipe';
import { recipe as input } from './input.recipe';
import { recipe as link } from './link.recipe';
import { recipe as popover } from './popover.recipe';
import { recipe as progressCircle } from './progress-circle.recipe';
import { recipe as skeleton } from './skeleton.recipe';
import { recipe as switchRecipe } from './switch.recipe';
import { recipe as tabs } from './tabs.recipe';
import { recipe as textarea } from './textarea.recipe';
import { recipe as toast } from './toast.recipe';
import { recipe as tooltip } from './tooltip.recipe';

export const recipes = {
  button,
  closeButton,
  input,
  link,
  skeleton,
  textarea,
};

export const slotRecipes = {
  alert,
  dialog,
  field,
  popover,
  progressCircle,
  'switch': switchRecipe,
  tabs,
  toast,
  tooltip,
};
