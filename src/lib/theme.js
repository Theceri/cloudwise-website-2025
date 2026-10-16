/** localStorage key for the visitor's theme choice ('light', or absent for dark). */
export const THEME_STORAGE_KEY = 'cw_theme';

/**
 * Sets the theme on <html> before the first paint, so a visitor who chose the
 * light theme never sees a dark flash. Rendered as an inline script in the
 * root layout. Dark is the default and the brand; light is opt-in only, so the
 * operating system's preference is not used. /studio always stays dark.
 */
export const THEME_INIT_SCRIPT = `try{if(localStorage.getItem('${THEME_STORAGE_KEY}')==='light'&&location.pathname.indexOf('/studio')!==0)document.documentElement.dataset.theme='light'}catch(e){}`;
