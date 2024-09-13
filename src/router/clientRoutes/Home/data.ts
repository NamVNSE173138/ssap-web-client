import homePage from '../../../constants/multilingual/homePage';
import { AttributeProps } from './components/Attribute';
import {faSearch, faCodeCompare, faShapes, faPaperPlane} from "@fortawesome/free-solid-svg-icons"

const attributes: AttributeProps[] = [
    {
        icon: faSearch,
        title: homePage.howToApply.FAST_SERVICE.TITLE,
        description: homePage.howToApply.FAST_SERVICE.DESCRIPTION,
    },
    {
        icon: faCodeCompare,
        title: homePage.howToApply.AFFORDABLE_PRICES.TITLE,
        description: homePage.howToApply.AFFORDABLE_PRICES.DESCRIPTION,
    },
    {
        icon: faShapes,
        title: homePage.howToApply.DIVERSE_SERVICES.TITLE,
        description: homePage.howToApply.DIVERSE_SERVICES.DESCRIPTION,
    },
    {
        icon: faPaperPlane,
        title: homePage.howToApply.EXTREMELY_SECURE.TITLE,
        description: homePage.howToApply.EXTREMELY_SECURE.DESCRIPTION,
    },
];

export default attributes;
