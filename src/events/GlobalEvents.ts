declare let namespace : any;
declare let GLOBAL : any;
/**
 * Inhabitant Events Registry
 */
namespace('GLOBAL').SELECTED_USER = 'GLOBAL.SELECTED_INHABITANT';
namespace('GLOBAL').RESET_SELECTED_USER = 'GLOBAL.RESET_SELECTED_INHABITANT';
namespace('GLOBAL').RESET_SELECTED_USER = 'GLOBAL.DELETE_INHABITANT';

/** 
 * Report Generation Events Registry
 */
namespace('GLOBAL.EXPORT').PDF = 'GLOBAL.EXPORT.PDF';
namespace('GLOBAL.EXPORT').EXCEL = 'GLOBAL.EXPORT.EXCEL';