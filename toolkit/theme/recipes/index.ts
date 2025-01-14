import { recipe as alert } from './alert.recipe';
import { recipe as button } from './button.recipe';
import { recipe as field } from './field.recipe';
import { recipe as input } from './input.recipe';
import { recipe as link } from './link.recipe';
import { recipe as popover } from './popover.recipe';
import { recipe as progressCircle } from './progress-circle.recipe';
import { recipe as skeleton } from './skeleton.recipe';
import { recipe as switchRecipe } from './switch.recipe';
import { recipe as tabs } from './tabs.recipe';
import { recipe as toast } from './toast.recipe';
import { recipe as tooltip } from './tooltip.recipe';

export const recipes = {
  button,
  input,
  link,
  skeleton,
};

export const slotRecipes = {
  alert,
  field,
  popover,
  progressCircle,
  'switch': switchRecipe,
  tabs,
  toast,
  tooltip,
};
