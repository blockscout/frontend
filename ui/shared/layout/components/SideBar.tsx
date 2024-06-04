import config from 'configs/app';
import NavigationDesktopVertical from 'ui/snippets/navigation/NavigationDesktopVertical';

const EmptyComponent = () => null;

export default config.UI.navigation.layout === 'horizontal' ? EmptyComponent : NavigationDesktopVertical;
