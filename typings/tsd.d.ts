/// <reference path="dojo/dojo.d.ts" />
/// <reference path="dojo/dijit.d.ts" />

/// <reference path="react/react.d.ts" />
/// <reference path="react/react-dom.d.ts" />
/// <reference path="mobx/mobx.d.ts" />
/// <reference path="mobx/mobx-react-devtool.d.ts" />


declare module "ColorPicker/lib/react-dom"
{
	export =  __React.__DOM;
}

declare module "ColorPicker/lib/react"
{
	export = __React;
}
declare module "ColorPicker/lib/react.min"
{
	export = __React;
}
// declare module "ColorPicker/lib/mobx.umd"
// { 
//     export {observable, transaction} from "mobx";
// }
// declare module "ColorPicker/lib/mobx.umd.min"
// {    
//     export {observable, transaction} from "mobx";
// }

// declare module "ColorPicker/lib/mobx-react"
// {    
//     export {observer} from "mobx-react";
// }

// declare module "ColorPicker/lib/mobx-react-devtools"
// {    
//     export interface IDevToolProps {
//         hightlightTimeout?: number;
//         position?: {
//             top?:    number | string;
//             right?:  number | string;
//             bottom?: number | string;
//             left?:   number | string;
//         }
//     }
//     export default class DevTools extends __React.Component<IDevToolProps, {}> { }
// }
