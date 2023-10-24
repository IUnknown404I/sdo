"use strict";(self.webpackChunkonyx_app=self.webpackChunkonyx_app||[]).push([[385],{"./components/basics/OnyxTypography.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{i:()=>OnyxTypography});var C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_extends_js__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/extends.js"),C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/defineProperty.js"),C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/slicedToArray.js"),_mui_material__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@mui/material/Typography/Typography.js"),_mui_material__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/@mui/base/ClickAwayListener/ClickAwayListener.js"),_mui_material__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/@mui/material/Tooltip/Tooltip.js"),_mui_material__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/@mui/material/Zoom/Zoom.js"),_mui_material__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./node_modules/@mui/material/Box/Box.js"),next_link__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/next/link.js"),next_link__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__),react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),__jsx=react__WEBPACK_IMPORTED_MODULE_0__.createElement;function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){(0,C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_1__.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var OnyxTypography=function OnyxTypography(props){var _React$useState=react__WEBPACK_IMPORTED_MODULE_0__.useState(!1),_React$useState2=(0,C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_3__.Z)(_React$useState,2),tooltipState=_React$useState2[0],setTooltipState=_React$useState2[1],component=__jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Z,(0,C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_extends_js__WEBPACK_IMPORTED_MODULE_5__.Z)({id:props.id},props.ariaProps,{component:props.component||(props.boxWrapper?"div":"p"),color:props.tpColor||(props.lkHref?"primary":void 0),fontSize:props.tpSize,fontWeight:props.tpWeight,variant:props.tpVariant||"body2",align:props.tpAlign||"left",sx:_objectSpread(_objectSpread({},props.tpSize?{}:{fontSize:"initial"}),props.lkHref||props.hoverStyles?props.sx&&!props.boxWrapper?mixSxProps(props.sx,!!props.lkHref||props.hoverStyles):hoverSxProps(!!props.lkHref||props.hoverStyles):props.sx),onClick:function onClick(e){return void 0!==props.onClick?props.onClick(e):{}}}),props.text,void 0===props.children?"":Array.isArray(props.children)?__jsx(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,props.children):props.children);return props.lkHref&&(component=__jsx(next_link__WEBPACK_IMPORTED_MODULE_2___default(),(0,C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_extends_js__WEBPACK_IMPORTED_MODULE_5__.Z)({href:props.lkHref,title:props.lkTitle},props.lkProps),component)),props.ttNode&&(component=props.ttOnClickMode?__jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.d,{onClickAway:function onClickAway(){return setTooltipState(!1)},disableReactTree:!0,mouseEvent:"onMouseDown",touchEvent:"onTouchStart"},__jsx("div",null,__jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Z,{sx:{width:"fit-content"},title:props.ttNode,placement:props.ttPlacement,followCursor:void 0===props.ttFollow||props.ttFollow,TransitionComponent:_mui_material__WEBPACK_IMPORTED_MODULE_8__.Z,PopperProps:{disablePortal:!0,sx:{"> div":{backgroundColor:"unset",maxWidth:"98vw"}}},open:tooltipState,onClose:function onClose(){return setTooltipState(!1)},disableFocusListener:!0,disableHoverListener:!0,disableTouchListener:!0},props.lkHref&&!props.boxWrapper?__jsx("span",{onClick:function onClick(){return setTooltipState((function(prev){return!prev}))}},component):__jsx("div",{onClick:function onClick(){return setTooltipState((function(prev){return!prev}))}},component)))):__jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Z,{title:props.ttNode,placement:props.ttPlacement,followCursor:void 0===props.ttFollow||props.ttFollow,PopperProps:{sx:{"> div":{maxWidth:"min(95vw, 450px)"}}}},props.lkHref&&!props.boxWrapper?__jsx("span",null,component):component)),props.boxWrapper?__jsx(_mui_material__WEBPACK_IMPORTED_MODULE_9__.Z,(0,C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_extends_js__WEBPACK_IMPORTED_MODULE_5__.Z)({},props.ariaProps,{width:props.boxWidth||"100%",sx:_objectSpread(_objectSpread({},props.sx),{},{"> a > div":{display:props.boxVerticalAlign?"flex":"",alignItems:props.boxVerticalAlign||"",gap:props.boxVerticalAlign?".25rem":""}}),display:props.boxAlign?"flex":"",justifyContent:props.boxAlign||"unset",alignItems:props.boxVerticalAlign||"unset",alignContent:props.boxAlign||"unset"}),component):component};function hoverSxProps(){return arguments.length>0&&void 0!==arguments[0]&&arguments[0]?{transition:"all .2s ease-out","&:hover":{cursor:"pointer",color:"#416df1"}}:{transition:"all .2s ease-out","&:hover":{cursor:"pointer"}}}function mixSxProps(sx){return _objectSpread(_objectSpread({},hoverSxProps(arguments.length>1&&void 0!==arguments[1]&&arguments[1])),sx)}OnyxTypography.__docgenInfo={description:"@IUnknown404I Returns corporate link component. Can be restyled and wrapped by tooltip or wrapped by box wrapper according props attributes.\r\n@default props:\r\n- defaults: sx = undefined, hoverStyles = undefined\r\n- typography: tpVariant = 'body2', align = 'left' and tpColor = undefined, fontSize = 'initial';\r\n- link: lkHref = undefined;\r\n- tooltip: ttNode = undefined, ttOnClickMode = false; ttFollow = true if ttNode passed, ttPlacement = 'bottom';\r\n- box wrapper: boxWrapper = false, boxAlign and boxVerticalAlign = 'flex-start', boxWidth = '100%';\r\n@returns MUI Typography wrapped with the Link \\ tooltip or box components.",methods:[],displayName:"OnyxTypography",props:{id:{required:!1,tsType:{name:"string"},description:""},ariaProps:{required:!1,tsType:{name:"AriaAttributes"},description:""},component:{required:!1,tsType:{name:"ElementType",elements:[{name:"any"}],raw:"ElementType<any>"},description:""},children:{required:!1,tsType:{name:"union",raw:"ReactNode | ReactNode[]",elements:[{name:"ReactNode"},{name:"Array",elements:[{name:"ReactNode"}],raw:"ReactNode[]"}]},description:""},text:{required:!1,tsType:{name:"string"},description:""},sx:{required:!1,tsType:{name:"SxProps",elements:[{name:"Theme"}],raw:"SxProps<Theme>"},description:""},onClick:{required:!1,tsType:{name:"union",raw:"(() => void) | ((e: any) => void)",elements:[{name:"unknown"},{name:"unknown"}]},description:""},hoverStyles:{required:!1,tsType:{name:"boolean"},description:""},lkHref:{required:!1,tsType:{name:"string"},description:""},lkTitle:{required:!1,tsType:{name:"string"},description:""},lkProps:{required:!1,tsType:{name:"signature",type:"object",raw:"{\r\n\ttarget?: HTMLAttributeAnchorTarget;\r\n\trel?: 'norefferer' | string;\r\n}",signature:{properties:[{key:"target",value:{name:"HTMLAttributeAnchorTarget",required:!1}},{key:"rel",value:{name:"union",raw:"'norefferer' | string",elements:[{name:"literal",value:"'norefferer'"},{name:"string"}],required:!1}}]}},description:""},tpVariant:{required:!1,tsType:{name:"union",raw:"| 'button'\r\n| 'caption'\r\n| 'h1'\r\n| 'h2'\r\n| 'h3'\r\n| 'h4'\r\n| 'h5'\r\n| 'h6'\r\n| 'inherit'\r\n| 'subtitle1'\r\n| 'subtitle2'\r\n| 'body1'\r\n| 'body2'\r\n| 'overline'",elements:[{name:"literal",value:"'button'"},{name:"literal",value:"'caption'"},{name:"literal",value:"'h1'"},{name:"literal",value:"'h2'"},{name:"literal",value:"'h3'"},{name:"literal",value:"'h4'"},{name:"literal",value:"'h5'"},{name:"literal",value:"'h6'"},{name:"literal",value:"'inherit'"},{name:"literal",value:"'subtitle1'"},{name:"literal",value:"'subtitle2'"},{name:"literal",value:"'body1'"},{name:"literal",value:"'body2'"},{name:"literal",value:"'overline'"}]},description:""},tpSize:{required:!1,tsType:{name:"string"},description:""},tpWeight:{required:!1,tsType:{name:"union",raw:"'normal' | 'bold' | 'initial' | 'inherit' | 'unset'",elements:[{name:"literal",value:"'normal'"},{name:"literal",value:"'bold'"},{name:"literal",value:"'initial'"},{name:"literal",value:"'inherit'"},{name:"literal",value:"'unset'"}]},description:""},tpAlign:{required:!1,tsType:{name:"union",raw:"'right' | 'left' | 'inherit' | 'center' | 'justify'",elements:[{name:"literal",value:"'right'"},{name:"literal",value:"'left'"},{name:"literal",value:"'inherit'"},{name:"literal",value:"'center'"},{name:"literal",value:"'justify'"}]},description:""},tpColor:{required:!1,tsType:{name:"union",raw:"'primary' | 'secondary' | 'inherit' | 'initial' | string",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'inherit'"},{name:"literal",value:"'initial'"},{name:"string"}]},description:""},boxWrapper:{required:!1,tsType:{name:"boolean"},description:""},boxWidth:{required:!1,tsType:{name:"string"},description:""},boxAlign:{required:!1,tsType:{name:"union",raw:"'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'",elements:[{name:"literal",value:"'flex-start'"},{name:"literal",value:"'flex-end'"},{name:"literal",value:"'center'"},{name:"literal",value:"'space-between'"},{name:"literal",value:"'space-around'"}]},description:""},boxVerticalAlign:{required:!1,tsType:{name:"union",raw:"'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'",elements:[{name:"literal",value:"'flex-start'"},{name:"literal",value:"'flex-end'"},{name:"literal",value:"'center'"},{name:"literal",value:"'space-between'"},{name:"literal",value:"'space-around'"}]},description:""},ttNode:{required:!1,tsType:{name:"ReactNode"},description:""},ttFollow:{required:!1,tsType:{name:"boolean"},description:""},ttOnClickMode:{required:!1,tsType:{name:"boolean"},description:""},ttPlacement:{required:!1,tsType:{name:"union",raw:"| 'bottom'\r\n| 'left'\r\n| 'right'\r\n| 'top'\r\n| 'bottom-end'\r\n| 'bottom-start'\r\n| 'left-end'\r\n| 'left-start'\r\n| 'right-end'\r\n| 'right-start'\r\n| 'top-end'\r\n| 'top-start'",elements:[{name:"literal",value:"'bottom'"},{name:"literal",value:"'left'"},{name:"literal",value:"'right'"},{name:"literal",value:"'top'"},{name:"literal",value:"'bottom-end'"},{name:"literal",value:"'bottom-start'"},{name:"literal",value:"'left-end'"},{name:"literal",value:"'left-start'"},{name:"literal",value:"'right-end'"},{name:"literal",value:"'right-start'"},{name:"literal",value:"'top-end'"},{name:"literal",value:"'top-start'"}]},description:""}}};try{OnyxTypography.displayName="OnyxTypography",OnyxTypography.__docgenInfo={description:"",displayName:"OnyxTypography",props:{id:{defaultValue:null,description:"",name:"id",required:!1,type:{name:"string"}},ariaProps:{defaultValue:null,description:"",name:"ariaProps",required:!1,type:{name:"AriaAttributes"}},component:{defaultValue:null,description:"",name:"component",required:!1,type:{name:"ElementType<any>"}},text:{defaultValue:null,description:"",name:"text",required:!1,type:{name:"string"}},sx:{defaultValue:null,description:"",name:"sx",required:!1,type:{name:"SxProps<Theme>"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void) | ((e: any) => void)"}},hoverStyles:{defaultValue:null,description:"",name:"hoverStyles",required:!1,type:{name:"boolean"}},lkHref:{defaultValue:null,description:"",name:"lkHref",required:!1,type:{name:"string"}},lkTitle:{defaultValue:null,description:"",name:"lkTitle",required:!1,type:{name:"string"}},lkProps:{defaultValue:null,description:"",name:"lkProps",required:!1,type:{name:"{ target?: HTMLAttributeAnchorTarget; rel?: string; } | undefined"}},tpVariant:{defaultValue:null,description:"",name:"tpVariant",required:!1,type:{name:"enum",value:[{value:'"button"'},{value:'"caption"'},{value:'"h1"'},{value:'"h2"'},{value:'"h3"'},{value:'"h4"'},{value:'"h5"'},{value:'"h6"'},{value:'"inherit"'},{value:'"subtitle1"'},{value:'"subtitle2"'},{value:'"body1"'},{value:'"body2"'},{value:'"overline"'}]}},tpSize:{defaultValue:null,description:"",name:"tpSize",required:!1,type:{name:"string"}},tpWeight:{defaultValue:null,description:"",name:"tpWeight",required:!1,type:{name:"enum",value:[{value:'"inherit"'},{value:'"normal"'},{value:'"bold"'},{value:'"initial"'},{value:'"unset"'}]}},tpAlign:{defaultValue:null,description:"",name:"tpAlign",required:!1,type:{name:"enum",value:[{value:'"left"'},{value:'"right"'},{value:'"inherit"'},{value:'"center"'},{value:'"justify"'}]}},tpColor:{defaultValue:null,description:"",name:"tpColor",required:!1,type:{name:"string"}},boxWrapper:{defaultValue:null,description:"",name:"boxWrapper",required:!1,type:{name:"boolean"}},boxWidth:{defaultValue:null,description:"",name:"boxWidth",required:!1,type:{name:"string"}},boxAlign:{defaultValue:null,description:"",name:"boxAlign",required:!1,type:{name:"enum",value:[{value:'"center"'},{value:'"flex-start"'},{value:'"flex-end"'},{value:'"space-between"'},{value:'"space-around"'}]}},boxVerticalAlign:{defaultValue:null,description:"",name:"boxVerticalAlign",required:!1,type:{name:"enum",value:[{value:'"center"'},{value:'"flex-start"'},{value:'"flex-end"'},{value:'"space-between"'},{value:'"space-around"'}]}},ttNode:{defaultValue:null,description:"",name:"ttNode",required:!1,type:{name:"ReactNode"}},ttFollow:{defaultValue:null,description:"",name:"ttFollow",required:!1,type:{name:"boolean"}},ttOnClickMode:{defaultValue:null,description:"",name:"ttOnClickMode",required:!1,type:{name:"boolean"}},ttPlacement:{defaultValue:null,description:"",name:"ttPlacement",required:!1,type:{name:"enum",value:[{value:'"bottom"'},{value:'"left"'},{value:'"right"'},{value:'"top"'},{value:'"bottom-end"'},{value:'"bottom-start"'},{value:'"left-end"'},{value:'"left-start"'},{value:'"right-end"'},{value:'"right-start"'},{value:'"top-end"'},{value:'"top-start"'}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["components/basics/OnyxTypography.tsx#OnyxTypography"]={docgenInfo:OnyxTypography.__docgenInfo,name:"OnyxTypography",path:"components/basics/OnyxTypography.tsx#OnyxTypography"})}catch(__react_docgen_typescript_loader_error){}},"./stories/basics/OnyxSelect.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Onyx_Select:()=>Onyx_Select,default:()=>OnyxSelect_stories});var defineProperty=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/defineProperty.js"),slicedToArray=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/slicedToArray.js"),Box=__webpack_require__("./node_modules/@mui/material/Box/Box.js"),Button=__webpack_require__("./node_modules/@mui/material/Button/Button.js"),FormControl=__webpack_require__("./node_modules/@mui/material/FormControl/FormControl.js"),FormControlLabel=__webpack_require__("./node_modules/@mui/material/FormControlLabel/FormControlLabel.js"),Select=__webpack_require__("./node_modules/@mui/material/Select/Select.js"),MenuItem=__webpack_require__("./node_modules/@mui/material/MenuItem/MenuItem.js"),react=__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),OnyxTypography=__webpack_require__("./components/basics/OnyxTypography.tsx"),__jsx=react.createElement;function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){(0,defineProperty.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var flexBase={display:"flex",flexDirection:"row",justifyContent:"flex-start",alignItems:"center",gap:".75rem"},OnyxSelect=function OnyxSelect(props){var _props$helperText,_props$helperText2,_React$useState=react.useState(void 0===props.initialIndex?-1:props.initialIndex),_React$useState2=(0,slicedToArray.Z)(_React$useState,2),val=_React$useState2[0],setVal=_React$useState2[1],_React$useState3=react.useState(!1),_React$useState4=(0,slicedToArray.Z)(_React$useState3,2),open=_React$useState4[0],setOpen=_React$useState4[1],handleChange=function handleChange(event){null!=props.setValue?props.setValue(event):setVal(event.target.value)},handleClose=function handleClose(){setOpen(!1)},handleOpen=function handleOpen(){setOpen(!0)};return null!=props.helperText&&"button"===props.helperText.type?__jsx(Box.Z,{sx:_objectSpread(_objectSpread({},flexBase),null===(_props$helperText=props.helperText)||void 0===_props$helperText?void 0:_props$helperText.containerSx)},null==props.reversed&&__jsx(MainBlock,null),__jsx(Button.Z,{sx:{display:"inline",mt:2,textTransform:"none",color:"inherit",fontSize:"1.15rem",marginTop:"0",marginLeft:props.reversed?"0":".5rem",marginRight:props.reversed?".5rem":"0"},size:"large",variant:"text",onClick:handleOpen},props.helperText.text),null!=props.reversed&&__jsx(MainBlock,null)):null==props.helperText||void 0!==props.helperText.type&&"text"!==props.helperText.type?__jsx(MainBlock,null):__jsx(Box.Z,{sx:_objectSpread(_objectSpread({},flexBase),null===(_props$helperText2=props.helperText)||void 0===_props$helperText2?void 0:_props$helperText2.containerSx)},null==props.reversed&&__jsx(MainBlock,null),__jsx(OnyxTypography.i,{onClick:handleOpen,sx:{cursor:"pointer"}},props.helperText.text),null!=props.reversed&&__jsx(MainBlock,null));function MainBlock(){return __jsx(FormControl.Z,{fullWidth:props.fullwidth},null!=props.label?__jsx(FormControlLabel.Z,{label:props.label,labelPlacement:props.labelPlacement||"start",control:__jsx(SelectElement,null),sx:{gap:".5rem","> label":{gap:".75rem"}}}):__jsx(SelectElement,null))}function SelectElement(){return __jsx(Select.Z,{disabled:props.disabled,disableUnderline:!0,variant:"outlined",size:props.size||"small",open,value:props.value||val,onOpen:handleOpen,onClose:handleClose,onChange:handleChange,sx:{minWidth:"175px",fieldset:{borderColor:"#7FB7DC"}}},!props.disableEmptyOption&&__jsx(MenuItem.Z,{value:-1},__jsx("em",null,"Не указано")),props.listItems.map((function(el,index){return __jsx(MenuItem.Z,{value:null==props.itemsIndexes?index:props.itemsIndexes[index],key:el+""+(null==props.itemsIndexes?index:props.itemsIndexes[index])},el)})))}};OnyxSelect.__docgenInfo={description:"@IUnknown404I Corporate Switch component.\r\n@param props as config Object:\r\n \t- listItems: string[] that will be presented as options in menu;\r\n\t- value: as an value of select. Only for controlled select;\r\n\t- setValue: as onChange function for select component. Only for controlled select;\r\n\t- itemsIndexes?: (number|string)[] as array of indexes for list items;\r\n\t- initialIndex?: number|string as initial index of selected menu option. Only for uncontrollable select;\r\n\t- size?: 'small' | 'medium' as size of MUI component;\r\n\t- disabled?: boolean;\r\n\t- reversed?: boolean - initially displaing select and text after; if passed true will be reversed;\r\n\t- label?: string as built-in MUI label attribute;\r\n\t- labelPlacement?: 'bottom' | 'top' | 'end' | 'start' as built-in MUI label-placement attribute;\r\n\t- helperText?: that option creates button on interactive text with onClick event that will open the menu too. Passed as Object: {\r\n\t\ttext: string;\r\n\t\ttype?: 'text' | 'button';\r\n\t\tcontainerSx?: SxProps;\r\n@returns JSX.Element as Switch node.",methods:[],displayName:"OnyxSelect",props:{listItems:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},value:{required:!0,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:""},setValue:{required:!0,tsType:{name:"signature",type:"function",raw:"(e: SelectChangeEvent<string | number>) => void",signature:{arguments:[{name:"e",type:{name:"SelectChangeEvent",elements:[{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]}],raw:"SelectChangeEvent<string | number>"}}],return:{name:"void"}}},description:""},itemsIndexes:{required:!1,tsType:{name:"Array",elements:[{name:"unknown"}],raw:"(string | number)[]"},description:""},initialIndex:{required:!1,tsType:{name:"union",raw:"string | number",elements:[{name:"string"},{name:"number"}]},description:""},size:{required:!1,tsType:{name:"union",raw:"'small' | 'medium'",elements:[{name:"literal",value:"'small'"},{name:"literal",value:"'medium'"}]},description:""},disabled:{required:!1,tsType:{name:"boolean"},description:""},reversed:{required:!1,tsType:{name:"boolean"},description:""},label:{required:!1,tsType:{name:"string"},description:""},labelPlacement:{required:!1,tsType:{name:"union",raw:"'bottom' | 'top' | 'end' | 'start'",elements:[{name:"literal",value:"'bottom'"},{name:"literal",value:"'top'"},{name:"literal",value:"'end'"},{name:"literal",value:"'start'"}]},description:""},disableEmptyOption:{required:!1,tsType:{name:"boolean"},description:""},helperText:{required:!1,tsType:{name:"signature",type:"object",raw:"{\r\n\ttext: string;\r\n\ttype?: 'text' | 'button';\r\n\tcontainerSx?: SxProps;\r\n}",signature:{properties:[{key:"text",value:{name:"string",required:!0}},{key:"type",value:{name:"union",raw:"'text' | 'button'",elements:[{name:"literal",value:"'text'"},{name:"literal",value:"'button'"}],required:!1}},{key:"containerSx",value:{name:"SxProps",required:!1}}]}},description:""},fullwidth:{required:!1,tsType:{name:"boolean"},description:""}}};const basics_OnyxSelect=OnyxSelect;try{OnyxSelect.displayName="OnyxSelect",OnyxSelect.__docgenInfo={description:"",displayName:"OnyxSelect",props:{listItems:{defaultValue:null,description:"",name:"listItems",required:!0,type:{name:"string[]"}},value:{defaultValue:null,description:"",name:"value",required:!0,type:{name:"string | number"}},setValue:{defaultValue:null,description:"",name:"setValue",required:!0,type:{name:"(e: SelectChangeEvent<string | number>) => void"}},itemsIndexes:{defaultValue:null,description:"",name:"itemsIndexes",required:!1,type:{name:"(string | number)[]"}},initialIndex:{defaultValue:null,description:"",name:"initialIndex",required:!1,type:{name:"string | number"}},size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"enum",value:[{value:'"small"'},{value:'"medium"'}]}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}},reversed:{defaultValue:null,description:"",name:"reversed",required:!1,type:{name:"boolean"}},label:{defaultValue:null,description:"",name:"label",required:!1,type:{name:"string"}},labelPlacement:{defaultValue:null,description:"",name:"labelPlacement",required:!1,type:{name:"enum",value:[{value:'"bottom"'},{value:'"top"'},{value:'"end"'},{value:'"start"'}]}},disableEmptyOption:{defaultValue:null,description:"",name:"disableEmptyOption",required:!1,type:{name:"boolean"}},helperText:{defaultValue:null,description:"",name:"helperText",required:!1,type:{name:'{ text: string; type?: "button" | "text"; containerSx?: SxProps; } | undefined'}},fullwidth:{defaultValue:null,description:"",name:"fullwidth",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["components/basics/OnyxSelect.tsx#OnyxSelect"]={docgenInfo:OnyxSelect.__docgenInfo,name:"OnyxSelect",path:"components/basics/OnyxSelect.tsx#OnyxSelect"})}catch(__react_docgen_typescript_loader_error){}var _Onyx_Select$paramete,_Onyx_Select$paramete2;function OnyxSelect_stories_ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function OnyxSelect_stories_objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?OnyxSelect_stories_ownKeys(Object(t),!0).forEach((function(r){(0,defineProperty.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):OnyxSelect_stories_ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}const OnyxSelect_stories={title:"Basics/Select",component:basics_OnyxSelect,tags:["autodocs"]};var Onyx_Select={args:{helperText:{text:"helper text as string or button",type:"button"},label:"Onyx-Select element",labelPlacement:"start",size:"medium",listItems:["Option 1","Option 2","Option 3","Option 4","Option 5"]}};Onyx_Select.parameters=OnyxSelect_stories_objectSpread(OnyxSelect_stories_objectSpread({},Onyx_Select.parameters),{},{docs:OnyxSelect_stories_objectSpread(OnyxSelect_stories_objectSpread({},null===(_Onyx_Select$paramete=Onyx_Select.parameters)||void 0===_Onyx_Select$paramete?void 0:_Onyx_Select$paramete.docs),{},{source:OnyxSelect_stories_objectSpread({originalSource:"{\n  args: {\n    helperText: {\n      text: 'helper text as string or button',\n      type: 'button'\n    },\n    label: 'Onyx-Select element',\n    labelPlacement: 'start',\n    size: 'medium',\n    listItems: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']\n  }\n}"},null===(_Onyx_Select$paramete2=Onyx_Select.parameters)||void 0===_Onyx_Select$paramete2||null===(_Onyx_Select$paramete2=_Onyx_Select$paramete2.docs)||void 0===_Onyx_Select$paramete2?void 0:_Onyx_Select$paramete2.source)})})}}]);