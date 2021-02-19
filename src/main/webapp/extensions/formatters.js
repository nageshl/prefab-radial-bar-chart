/**
 * This file is used to extend the app runtime
 *
 * Custom Pipes:
 * Used for data formatting across widgets. Apart from predefined pipes like toDate, toCurrency, prefix, etc, you can define custom pipes here.
 * Once defined here, custom pipes appear in the "Use Expression" tab of data binding dialog.
 * E.g. Here is sample custom pipe (for data formatting)
 *   myPipe : {
 *     formatter : function(data, param1){
 *       // your logic goes here
 *       return data;
 *     },
 *     config: {
 *       param1: {
 *         name: '',
 *         widget: '',
 *         value: ''
 *       }...
 *     }
 *   }
 *
 * Terminology
 * myPipe       :   Name of the custom pipe
 * formatter :   Function where you can write the logic to format the data. The returned value from this function will be applied on the property this pipe is bound to
 * config       :   parameter information required during the design time. List down all the parameters required for your pipe function
 *                  Each param has following info
 *                  - name      : name of the parameter to display during design time
 *                  - widget    : widget to take parameter input from the user. E.g. text, select
 *                  - value     : default value if user doesn't provide any value
 */

var WM_CUSTOM_FORMATTERS = (function(){
  // Define custom pipes here.
    return {


   }

  })();
