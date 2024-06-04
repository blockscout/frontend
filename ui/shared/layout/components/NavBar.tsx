import config from 'configs/app';
import NavigationDesktopHorizontal from 'ui/snippets/navigation/NavigationDesktopHorizontal';

const EmptyComponent = () => null;

export default config.UI.navigation.layout === 'horizontal' ? NavigationDesktopHorizontal : EmptyComponent;
