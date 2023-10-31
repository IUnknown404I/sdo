"use strict";(self.webpackChunkonyx_app=self.webpackChunkonyx_app||[]).push([[311],{"./components/basics/OnyxTypography.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{i:()=>OnyxTypography});var C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_extends_js__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/extends.js"),C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/defineProperty.js"),C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/slicedToArray.js"),_mui_material__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@mui/material/Typography/Typography.js"),_mui_material__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/@mui/base/ClickAwayListener/ClickAwayListener.js"),_mui_material__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/@mui/material/Tooltip/Tooltip.js"),_mui_material__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/@mui/material/Zoom/Zoom.js"),_mui_material__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./node_modules/@mui/material/Box/Box.js"),next_link__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/next/link.js"),next_link__WEBPACK_IMPORTED_MODULE_2___default=__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_2__),react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),__jsx=react__WEBPACK_IMPORTED_MODULE_0__.createElement;function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){(0,C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_defineProperty_js__WEBPACK_IMPORTED_MODULE_1__.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var OnyxTypography=function OnyxTypography(props){var _React$useState=react__WEBPACK_IMPORTED_MODULE_0__.useState(!1),_React$useState2=(0,C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_slicedToArray_js__WEBPACK_IMPORTED_MODULE_3__.Z)(_React$useState,2),tooltipState=_React$useState2[0],setTooltipState=_React$useState2[1],component=__jsx(_mui_material__WEBPACK_IMPORTED_MODULE_4__.Z,(0,C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_extends_js__WEBPACK_IMPORTED_MODULE_5__.Z)({id:props.id},props.ariaProps,{component:props.component||(props.boxWrapper?"div":"p"),color:props.tpColor||(props.lkHref?"primary":void 0),fontSize:props.tpSize,fontWeight:props.tpWeight,variant:props.tpVariant||"body2",align:props.tpAlign||"left",sx:_objectSpread(_objectSpread({},props.tpSize?{}:{fontSize:"initial"}),props.lkHref||props.hoverStyles?props.sx&&!props.boxWrapper?mixSxProps(props.sx,!!props.lkHref||props.hoverStyles):hoverSxProps(!!props.lkHref||props.hoverStyles):props.sx),onClick:function onClick(e){return void 0!==props.onClick?props.onClick(e):{}}}),props.text,void 0===props.children?"":Array.isArray(props.children)?__jsx(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,props.children):props.children);return props.lkHref&&(component=__jsx(next_link__WEBPACK_IMPORTED_MODULE_2___default(),(0,C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_extends_js__WEBPACK_IMPORTED_MODULE_5__.Z)({href:props.lkHref,title:props.lkTitle},props.lkProps),component)),props.ttNode&&(component=props.ttOnClickMode?__jsx(_mui_material__WEBPACK_IMPORTED_MODULE_6__.d,{onClickAway:function onClickAway(){return setTooltipState(!1)},disableReactTree:!0,mouseEvent:"onMouseDown",touchEvent:"onTouchStart"},__jsx("div",null,__jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Z,{sx:{width:"fit-content"},title:props.ttNode,placement:props.ttPlacement,followCursor:void 0===props.ttFollow||props.ttFollow,TransitionComponent:_mui_material__WEBPACK_IMPORTED_MODULE_8__.Z,PopperProps:{disablePortal:!0,sx:{"> div":{backgroundColor:"unset",maxWidth:"98vw"}}},open:tooltipState,onClose:function onClose(){return setTooltipState(!1)},disableFocusListener:!0,disableHoverListener:!0,disableTouchListener:!0},props.lkHref&&!props.boxWrapper?__jsx("span",{onClick:function onClick(){return setTooltipState((function(prev){return!prev}))}},component):__jsx("div",{onClick:function onClick(){return setTooltipState((function(prev){return!prev}))}},component)))):__jsx(_mui_material__WEBPACK_IMPORTED_MODULE_7__.Z,{title:props.ttNode,placement:props.ttPlacement,followCursor:void 0===props.ttFollow||props.ttFollow,PopperProps:{sx:{"> div":{maxWidth:"min(95vw, 450px)"}}}},props.lkHref&&!props.boxWrapper?__jsx("span",null,component):component)),props.boxWrapper?__jsx(_mui_material__WEBPACK_IMPORTED_MODULE_9__.Z,(0,C_Users_Metrolog_Desktop_GMI_git_organization_sdo_onyx_client_node_modules_babel_runtime_helpers_esm_extends_js__WEBPACK_IMPORTED_MODULE_5__.Z)({},props.ariaProps,{width:props.boxWidth||"100%",sx:_objectSpread(_objectSpread({},props.sx),{},{"> a > div":{display:props.boxVerticalAlign?"flex":"",alignItems:props.boxVerticalAlign||"",gap:props.boxVerticalAlign?".25rem":""}}),display:props.boxAlign?"flex":"",justifyContent:props.boxAlign||"unset",alignItems:props.boxVerticalAlign||"unset",alignContent:props.boxAlign||"unset"}),component):component};function hoverSxProps(){return arguments.length>0&&void 0!==arguments[0]&&arguments[0]?{transition:"all .2s ease-out","&:hover":{cursor:"pointer",color:"#416df1"}}:{transition:"all .2s ease-out","&:hover":{cursor:"pointer"}}}function mixSxProps(sx){return _objectSpread(_objectSpread({},hoverSxProps(arguments.length>1&&void 0!==arguments[1]&&arguments[1])),sx)}OnyxTypography.__docgenInfo={description:"@IUnknown404I Returns corporate link component. Can be restyled and wrapped by tooltip or wrapped by box wrapper according props attributes.\r\n@default props:\r\n- defaults: sx = undefined, hoverStyles = undefined\r\n- typography: tpVariant = 'body2', align = 'left' and tpColor = undefined, fontSize = 'initial';\r\n- link: lkHref = undefined;\r\n- tooltip: ttNode = undefined, ttOnClickMode = false; ttFollow = true if ttNode passed, ttPlacement = 'bottom';\r\n- box wrapper: boxWrapper = false, boxAlign and boxVerticalAlign = 'flex-start', boxWidth = '100%';\r\n@returns MUI Typography wrapped with the Link \\ tooltip or box components.",methods:[],displayName:"OnyxTypography",props:{id:{required:!1,tsType:{name:"string"},description:""},ariaProps:{required:!1,tsType:{name:"AriaAttributes"},description:""},component:{required:!1,tsType:{name:"ElementType",elements:[{name:"any"}],raw:"ElementType<any>"},description:""},children:{required:!1,tsType:{name:"union",raw:"ReactNode | ReactNode[]",elements:[{name:"ReactNode"},{name:"Array",elements:[{name:"ReactNode"}],raw:"ReactNode[]"}]},description:""},text:{required:!1,tsType:{name:"string"},description:""},sx:{required:!1,tsType:{name:"SxProps",elements:[{name:"Theme"}],raw:"SxProps<Theme>"},description:""},onClick:{required:!1,tsType:{name:"union",raw:"(() => void) | ((e: any) => void)",elements:[{name:"unknown"},{name:"unknown"}]},description:""},hoverStyles:{required:!1,tsType:{name:"boolean"},description:""},lkHref:{required:!1,tsType:{name:"string"},description:""},lkTitle:{required:!1,tsType:{name:"string"},description:""},lkProps:{required:!1,tsType:{name:"signature",type:"object",raw:"{\r\n\ttarget?: HTMLAttributeAnchorTarget;\r\n\trel?: 'norefferer' | string;\r\n}",signature:{properties:[{key:"target",value:{name:"HTMLAttributeAnchorTarget",required:!1}},{key:"rel",value:{name:"union",raw:"'norefferer' | string",elements:[{name:"literal",value:"'norefferer'"},{name:"string"}],required:!1}}]}},description:""},tpVariant:{required:!1,tsType:{name:"union",raw:"| 'button'\r\n| 'caption'\r\n| 'h1'\r\n| 'h2'\r\n| 'h3'\r\n| 'h4'\r\n| 'h5'\r\n| 'h6'\r\n| 'inherit'\r\n| 'subtitle1'\r\n| 'subtitle2'\r\n| 'body1'\r\n| 'body2'\r\n| 'overline'",elements:[{name:"literal",value:"'button'"},{name:"literal",value:"'caption'"},{name:"literal",value:"'h1'"},{name:"literal",value:"'h2'"},{name:"literal",value:"'h3'"},{name:"literal",value:"'h4'"},{name:"literal",value:"'h5'"},{name:"literal",value:"'h6'"},{name:"literal",value:"'inherit'"},{name:"literal",value:"'subtitle1'"},{name:"literal",value:"'subtitle2'"},{name:"literal",value:"'body1'"},{name:"literal",value:"'body2'"},{name:"literal",value:"'overline'"}]},description:""},tpSize:{required:!1,tsType:{name:"string"},description:""},tpWeight:{required:!1,tsType:{name:"union",raw:"'normal' | 'bold' | 'initial' | 'inherit' | 'unset'",elements:[{name:"literal",value:"'normal'"},{name:"literal",value:"'bold'"},{name:"literal",value:"'initial'"},{name:"literal",value:"'inherit'"},{name:"literal",value:"'unset'"}]},description:""},tpAlign:{required:!1,tsType:{name:"union",raw:"'right' | 'left' | 'inherit' | 'center' | 'justify'",elements:[{name:"literal",value:"'right'"},{name:"literal",value:"'left'"},{name:"literal",value:"'inherit'"},{name:"literal",value:"'center'"},{name:"literal",value:"'justify'"}]},description:""},tpColor:{required:!1,tsType:{name:"union",raw:"'primary' | 'secondary' | 'inherit' | 'initial' | string",elements:[{name:"literal",value:"'primary'"},{name:"literal",value:"'secondary'"},{name:"literal",value:"'inherit'"},{name:"literal",value:"'initial'"},{name:"string"}]},description:""},boxWrapper:{required:!1,tsType:{name:"boolean"},description:""},boxWidth:{required:!1,tsType:{name:"string"},description:""},boxAlign:{required:!1,tsType:{name:"union",raw:"'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'",elements:[{name:"literal",value:"'flex-start'"},{name:"literal",value:"'flex-end'"},{name:"literal",value:"'center'"},{name:"literal",value:"'space-between'"},{name:"literal",value:"'space-around'"}]},description:""},boxVerticalAlign:{required:!1,tsType:{name:"union",raw:"'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'",elements:[{name:"literal",value:"'flex-start'"},{name:"literal",value:"'flex-end'"},{name:"literal",value:"'center'"},{name:"literal",value:"'space-between'"},{name:"literal",value:"'space-around'"}]},description:""},ttNode:{required:!1,tsType:{name:"ReactNode"},description:""},ttFollow:{required:!1,tsType:{name:"boolean"},description:""},ttOnClickMode:{required:!1,tsType:{name:"boolean"},description:""},ttPlacement:{required:!1,tsType:{name:"union",raw:"| 'bottom'\r\n| 'left'\r\n| 'right'\r\n| 'top'\r\n| 'bottom-end'\r\n| 'bottom-start'\r\n| 'left-end'\r\n| 'left-start'\r\n| 'right-end'\r\n| 'right-start'\r\n| 'top-end'\r\n| 'top-start'",elements:[{name:"literal",value:"'bottom'"},{name:"literal",value:"'left'"},{name:"literal",value:"'right'"},{name:"literal",value:"'top'"},{name:"literal",value:"'bottom-end'"},{name:"literal",value:"'bottom-start'"},{name:"literal",value:"'left-end'"},{name:"literal",value:"'left-start'"},{name:"literal",value:"'right-end'"},{name:"literal",value:"'right-start'"},{name:"literal",value:"'top-end'"},{name:"literal",value:"'top-start'"}]},description:""}}};try{OnyxTypography.displayName="OnyxTypography",OnyxTypography.__docgenInfo={description:"",displayName:"OnyxTypography",props:{id:{defaultValue:null,description:"",name:"id",required:!1,type:{name:"string"}},ariaProps:{defaultValue:null,description:"",name:"ariaProps",required:!1,type:{name:"AriaAttributes"}},component:{defaultValue:null,description:"",name:"component",required:!1,type:{name:"ElementType<any>"}},text:{defaultValue:null,description:"",name:"text",required:!1,type:{name:"string"}},sx:{defaultValue:null,description:"",name:"sx",required:!1,type:{name:"SxProps<Theme>"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!1,type:{name:"(() => void) | ((e: any) => void)"}},hoverStyles:{defaultValue:null,description:"",name:"hoverStyles",required:!1,type:{name:"boolean"}},lkHref:{defaultValue:null,description:"",name:"lkHref",required:!1,type:{name:"string"}},lkTitle:{defaultValue:null,description:"",name:"lkTitle",required:!1,type:{name:"string"}},lkProps:{defaultValue:null,description:"",name:"lkProps",required:!1,type:{name:"{ target?: HTMLAttributeAnchorTarget; rel?: string; } | undefined"}},tpVariant:{defaultValue:null,description:"",name:"tpVariant",required:!1,type:{name:"enum",value:[{value:'"button"'},{value:'"caption"'},{value:'"h1"'},{value:'"h2"'},{value:'"h3"'},{value:'"h4"'},{value:'"h5"'},{value:'"h6"'},{value:'"inherit"'},{value:'"subtitle1"'},{value:'"subtitle2"'},{value:'"body1"'},{value:'"body2"'},{value:'"overline"'}]}},tpSize:{defaultValue:null,description:"",name:"tpSize",required:!1,type:{name:"string"}},tpWeight:{defaultValue:null,description:"",name:"tpWeight",required:!1,type:{name:"enum",value:[{value:'"inherit"'},{value:'"normal"'},{value:'"bold"'},{value:'"initial"'},{value:'"unset"'}]}},tpAlign:{defaultValue:null,description:"",name:"tpAlign",required:!1,type:{name:"enum",value:[{value:'"left"'},{value:'"right"'},{value:'"inherit"'},{value:'"center"'},{value:'"justify"'}]}},tpColor:{defaultValue:null,description:"",name:"tpColor",required:!1,type:{name:"string"}},boxWrapper:{defaultValue:null,description:"",name:"boxWrapper",required:!1,type:{name:"boolean"}},boxWidth:{defaultValue:null,description:"",name:"boxWidth",required:!1,type:{name:"string"}},boxAlign:{defaultValue:null,description:"",name:"boxAlign",required:!1,type:{name:"enum",value:[{value:'"center"'},{value:'"flex-start"'},{value:'"flex-end"'},{value:'"space-between"'},{value:'"space-around"'}]}},boxVerticalAlign:{defaultValue:null,description:"",name:"boxVerticalAlign",required:!1,type:{name:"enum",value:[{value:'"center"'},{value:'"flex-start"'},{value:'"flex-end"'},{value:'"space-between"'},{value:'"space-around"'}]}},ttNode:{defaultValue:null,description:"",name:"ttNode",required:!1,type:{name:"ReactNode"}},ttFollow:{defaultValue:null,description:"",name:"ttFollow",required:!1,type:{name:"boolean"}},ttOnClickMode:{defaultValue:null,description:"",name:"ttOnClickMode",required:!1,type:{name:"boolean"}},ttPlacement:{defaultValue:null,description:"",name:"ttPlacement",required:!1,type:{name:"enum",value:[{value:'"bottom"'},{value:'"left"'},{value:'"right"'},{value:'"top"'},{value:'"bottom-end"'},{value:'"bottom-start"'},{value:'"left-end"'},{value:'"left-start"'},{value:'"right-end"'},{value:'"right-start"'},{value:'"top-end"'},{value:'"top-start"'}]}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["components/basics/OnyxTypography.tsx#OnyxTypography"]={docgenInfo:OnyxTypography.__docgenInfo,name:"OnyxTypography",path:"components/basics/OnyxTypography.tsx#OnyxTypography"})}catch(__react_docgen_typescript_loader_error){}},"./stories/basics/OnyxBreadcrumbs.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Onyx_Breadcrumbs:()=>Onyx_Breadcrumbs,default:()=>OnyxBreadcrumbs_stories});var defineProperty=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/defineProperty.js"),esm_extends=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/extends.js"),toConsumableArray=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js"),slicedToArray=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/slicedToArray.js"),Box=__webpack_require__("./node_modules/@mui/material/Box/Box.js"),Stack=__webpack_require__("./node_modules/@mui/material/Stack/Stack.js"),Button=__webpack_require__("./node_modules/@mui/material/Button/Button.js"),List=__webpack_require__("./node_modules/@mui/material/List/List.js"),ListItem=__webpack_require__("./node_modules/@mui/material/ListItem/ListItem.js"),react=__webpack_require__("./node_modules/next/dist/compiled/react/index.js");function getWindowDimensions(window){if(window)return{clientWidth:window.innerWidth,clientHeight:window.innerHeight}}var OnyxTypography=__webpack_require__("./components/basics/OnyxTypography.tsx"),__jsx=react.createElement,OnyxBreacrumbs=function OnyxBreacrumbs(props){var windowDimensions=function useWindowDimensions(){var _useState=(0,react.useState)({clientWidth:0,clientHeight:0}),windowDimensions=_useState[0],setWindowDimensions=_useState[1];return(0,react.useEffect)((function(){function handleResize(){setWindowDimensions(getWindowDimensions(window))}return setWindowDimensions(getWindowDimensions(window)),window.addEventListener("resize",handleResize),function(){return window.removeEventListener("resize",handleResize)}}),[]),windowDimensions}(),_React$useState=react.useState(!1),_React$useState2=(0,slicedToArray.Z)(_React$useState,2),innerState=_React$useState2[0],setInnerState=_React$useState2[1],_React$useMemo=react.useMemo((function(){var breadcrumbs=[],innerBreadcrumbs=[];return!windowDimensions||windowDimensions.clientWidth>=1200?props.itemList.length<=3?breadcrumbs=(0,toConsumableArray.Z)(props.itemList):props.itemList.forEach((function(item,index){(0===index||index>=props.itemList.length-2)&&breadcrumbs.push(item),0!==index&&1===breadcrumbs.length&&innerBreadcrumbs.push(item)})):windowDimensions.clientWidth<1200&&props.itemList.forEach((function(item,index){0!==index&&index!==props.itemList.length-1||breadcrumbs.push(item),0!==index&&1===breadcrumbs.length&&innerBreadcrumbs.push(item)})),[breadcrumbs,innerBreadcrumbs]}),[windowDimensions]),_React$useMemo2=(0,slicedToArray.Z)(_React$useMemo,2),breadcrumbsItems=_React$useMemo2[0],innerBreadcrumbsItems=_React$useMemo2[1];return __jsx(Box.Z,{component:"nav",width:"100%",sx:props.sx,"aria-label":"breadcrumbs"},__jsx(Stack.Z,{component:"ol",width:"100%",direction:"row",flexWrap:"wrap",alignItems:"center",justifyContent:"flex-start",gap:1,sx:{listStyleType:"none"}},breadcrumbsItems.map((function(crumb,index){return __jsx(react.Fragment,null,__jsx(CrumbContent,(0,esm_extends.Z)({},crumb,{href:index!==breadcrumbsItems.length-1?crumb.href:void 0,lkProps:crumb.linkProps,tpColor:props.color||"secondary",tpSize:windowDimensions&&windowDimensions.clientWidth<=800?".85rem":props.fontSize||".9rem"})),index!==breadcrumbsItems.length-1&&__jsx("li",{style:{width:"fit-content"},"aria-hidden":!0},__jsx(OnyxTypography.i,{tpColor:props.color||"secondary",tpSize:windowDimensions&&windowDimensions.clientWidth<=800?".85rem":props.fontSize||".9rem"},props.separator||">")),0===index&&!!innerBreadcrumbsItems.length&&__jsx(react.Fragment,null,__jsx(Button.Z,{size:"small",variant:"text",sx:{position:"relative",minWidth:"25px"},onClick:function onClick(){return setInnerState((function(prev){return!prev}))}},"...",__jsx(List.Z,{dense:!0,disablePadding:!0,sx:{display:innerState?"":"none",position:"absolute",top:"100%",left:"100%",widows:"100%",transition:"all .25s",opacity:innerState?"1":"0",transform:"translateX(-50%)",backgroundColor:function backgroundColor(theme){return"light"===theme.palette.mode?"rgba(255,255,255,.85)":"rgba(29,43,58, .9)"},border:"1px solid lightgray",borderRadius:"8px",gap:".25rem"}},innerBreadcrumbsItems.map((function(crumb,index){return __jsx(ListItem.ZP,{key:index,disablePadding:!0,sx:{padding:".5rem",display:"flex",gap:".5rem",whiteSpace:"nowrap",textTransform:"none",svg:{fontSize:"1.35rem"}}},__jsx(CrumbContent,(0,esm_extends.Z)({},crumb,{lkHref:index!==props.itemList.length-1?crumb.href:void 0,lkProps:crumb.linkProps,tpColor:"primary",tpSize:windowDimensions&&windowDimensions.clientWidth<=800?".85rem":props.fontSize||".9rem"})))})))),__jsx("li",{style:{width:"fit-content"},"aria-hidden":!0},__jsx(OnyxTypography.i,{tpColor:props.color||"secondary",tpSize:windowDimensions&&windowDimensions.clientWidth<=800?".85rem":props.fontSize||".9rem"},props.separator||">"))))}))))};function CrumbContent(crumb){return __jsx(OnyxTypography.i,{component:"p","aria-hidden":"string"==typeof crumb.element,lkTitle:"Перейти",lkHref:crumb.href,lkProps:crumb.linkProps,tpColor:crumb.tpColor||"secondary",tpSize:crumb.tpSize,sx:{width:"fit-content",display:"flex",justifyContent:"center",alignItems:"center",gap:".5rem",svg:{fontSize:"1.15rem",color:function color(theme){return theme.palette.primary.main}}}},crumb.icon&&"end"!==crumb.iconPosition&&crumb.icon,crumb.icon&&"end"!==crumb.iconPosition&&"string"==typeof crumb.icon&&__jsx(react.Fragment,null," "),crumb.element,crumb.icon&&!!crumb.iconPosition&&"start"!==crumb.iconPosition&&"string"==typeof crumb.icon&&__jsx(react.Fragment,null," "),crumb.icon&&!!crumb.iconPosition&&"start"!==crumb.iconPosition&&crumb.icon)}OnyxBreacrumbs.displayName="OnyxBreacrumbs",CrumbContent.displayName="CrumbContent",OnyxBreacrumbs.__docgenInfo={description:"@IUnknown404I Corporative breadcrumbs element with build-in adaptivity and auto-changing max-elements-size duo to the viewport dimensions.\r\n@param props an Object:\r\n- itemlist: list of items to be processed as links { href: string, element: ReactElement, linkProps: BasicLinkProps };\r\n- color: as mui-color declaration (secondary by default);\r\n- fontSize: as string;\r\n- separator: as ReactNode or string for the separating passed items.\r\n@returns an ReactNode element.",methods:[],displayName:"OnyxBreacrumbs",props:{itemList:{required:!0,tsType:{name:"Array",elements:[{name:"BreadcrumbItem"}],raw:"BreadcrumbItem[]"},description:""},color:{required:!1,tsType:{name:"union",raw:"'secondary' | 'secondary' | string",elements:[{name:"literal",value:"'secondary'"},{name:"literal",value:"'secondary'"},{name:"string"}]},description:""},fontSize:{required:!1,tsType:{name:"string"},description:""},separator:{required:!1,tsType:{name:"union",raw:"string | React.ReactElement",elements:[{name:"string"},{name:"ReactReactElement",raw:"React.ReactElement"}]},description:""},sx:{required:!1,tsType:{name:"SxProps"},description:""}}};const basics_OnyxBreadcrumbs=OnyxBreacrumbs;try{OnyxBreadcrumbs.displayName="OnyxBreadcrumbs",OnyxBreadcrumbs.__docgenInfo={description:"",displayName:"OnyxBreadcrumbs",props:{itemList:{defaultValue:null,description:"",name:"itemList",required:!0,type:{name:"BreadcrumbItem[]"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"string"}},fontSize:{defaultValue:null,description:"",name:"fontSize",required:!1,type:{name:"string"}},separator:{defaultValue:null,description:"",name:"separator",required:!1,type:{name:"string | ReactElement<any, string | JSXElementConstructor<any>>"}},sx:{defaultValue:null,description:"",name:"sx",required:!1,type:{name:"SxProps"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["components/basics/OnyxBreadcrumbs.tsx#OnyxBreadcrumbs"]={docgenInfo:OnyxBreadcrumbs.__docgenInfo,name:"OnyxBreadcrumbs",path:"components/basics/OnyxBreadcrumbs.tsx#OnyxBreadcrumbs"})}catch(__react_docgen_typescript_loader_error){}var _Onyx_Breadcrumbs$par,_Onyx_Breadcrumbs$par2;function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){(0,defineProperty.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}const OnyxBreadcrumbs_stories={title:"Basics/Breadcrumbs",component:basics_OnyxBreadcrumbs,tags:["autodocs"]};var Onyx_Breadcrumbs={args:{itemList:[{element:"crumb 1",href:"href",icon:"[icon1]",iconPosition:"start"},{element:"inner 1",icon:"[icon]",iconPosition:"start"},{element:"inner 2",icon:"[icon]",iconPosition:"start"},{element:"inner 3",icon:"[icon]",iconPosition:"end"},{element:"crumb 2",icon:"[icon2]",iconPosition:"end"},{element:"crumb 3",href:"href",icon:"[icon3]"}],separator:">"}};Onyx_Breadcrumbs.parameters=_objectSpread(_objectSpread({},Onyx_Breadcrumbs.parameters),{},{docs:_objectSpread(_objectSpread({},null===(_Onyx_Breadcrumbs$par=Onyx_Breadcrumbs.parameters)||void 0===_Onyx_Breadcrumbs$par?void 0:_Onyx_Breadcrumbs$par.docs),{},{source:_objectSpread({originalSource:"{\n  args: {\n    itemList: [{\n      element: 'crumb 1',\n      href: 'href',\n      icon: '[icon1]',\n      iconPosition: 'start'\n    }, {\n      element: 'inner 1',\n      icon: '[icon]',\n      iconPosition: 'start'\n    }, {\n      element: 'inner 2',\n      icon: '[icon]',\n      iconPosition: 'start'\n    }, {\n      element: 'inner 3',\n      icon: '[icon]',\n      iconPosition: 'end'\n    }, {\n      element: 'crumb 2',\n      icon: '[icon2]',\n      iconPosition: 'end'\n    }, {\n      element: 'crumb 3',\n      href: 'href',\n      icon: '[icon3]'\n    }],\n    separator: '>'\n  }\n}"},null===(_Onyx_Breadcrumbs$par2=Onyx_Breadcrumbs.parameters)||void 0===_Onyx_Breadcrumbs$par2||null===(_Onyx_Breadcrumbs$par2=_Onyx_Breadcrumbs$par2.docs)||void 0===_Onyx_Breadcrumbs$par2?void 0:_Onyx_Breadcrumbs$par2.source)})})}}]);