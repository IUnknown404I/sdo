"use strict";(self.webpackChunkonyx_app=self.webpackChunkonyx_app||[]).push([[852],{"./node_modules/@mui/material/styles/defaultTheme.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__=(0,__webpack_require__("./node_modules/@mui/material/styles/createTheme.js").Z)()},"./node_modules/@mui/material/styles/styled.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Dz:()=>slotShouldForwardProp,FO:()=>rootShouldForwardProp,ZP:()=>__WEBPACK_DEFAULT_EXPORT__});var _mui_system__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@mui/system/esm/createStyled.js"),_defaultTheme__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@mui/material/styles/defaultTheme.js"),_identifier__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@mui/material/styles/identifier.js");const rootShouldForwardProp=prop=>(0,_mui_system__WEBPACK_IMPORTED_MODULE_0__.x9)(prop)&&"classes"!==prop,slotShouldForwardProp=_mui_system__WEBPACK_IMPORTED_MODULE_0__.x9,__WEBPACK_DEFAULT_EXPORT__=(0,_mui_system__WEBPACK_IMPORTED_MODULE_0__.ZP)({themeId:_identifier__WEBPACK_IMPORTED_MODULE_1__.Z,defaultTheme:_defaultTheme__WEBPACK_IMPORTED_MODULE_2__.Z,rootShouldForwardProp})},"./node_modules/@mui/material/styles/useThemeProps.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>useThemeProps});var _mui_system__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@mui/system/esm/useThemeProps/useThemeProps.js"),_defaultTheme__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@mui/material/styles/defaultTheme.js"),_identifier__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@mui/material/styles/identifier.js");function useThemeProps({props,name}){return(0,_mui_system__WEBPACK_IMPORTED_MODULE_0__.Z)({props,name,defaultTheme:_defaultTheme__WEBPACK_IMPORTED_MODULE_1__.Z,themeId:_identifier__WEBPACK_IMPORTED_MODULE_2__.Z})}},"./node_modules/@mui/material/utils/capitalize.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__=__webpack_require__("./node_modules/@mui/utils/esm/capitalize/capitalize.js").Z},"./node_modules/@mui/system/esm/createStyled.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{ZP:()=>createStyled,x9:()=>shouldForwardProp});var objectWithoutPropertiesLoose=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js"),esm_extends=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/extends.js"),styled_engine=__webpack_require__("./node_modules/@mui/styled-engine/index.js"),deepmerge=__webpack_require__("./node_modules/@mui/utils/esm/deepmerge.js"),createTheme=__webpack_require__("./node_modules/@mui/system/esm/createTheme/createTheme.js"),capitalize=__webpack_require__("./node_modules/@mui/utils/esm/capitalize/capitalize.js");const _excluded=["variant"];function isEmpty(string){return 0===string.length}function propsToClassKey(props){const{variant}=props,other=(0,objectWithoutPropertiesLoose.Z)(props,_excluded);let classKey=variant||"";return Object.keys(other).sort().forEach((key=>{classKey+="color"===key?isEmpty(classKey)?props[key]:(0,capitalize.Z)(props[key]):`${isEmpty(classKey)?key:(0,capitalize.Z)(key)}${(0,capitalize.Z)(props[key].toString())}`})),classKey}var styleFunctionSx=__webpack_require__("./node_modules/@mui/system/esm/styleFunctionSx/styleFunctionSx.js");const createStyled_excluded=["name","slot","skipVariantsResolver","skipSx","overridesResolver"];const getStyleOverrides=(name,theme)=>theme.components&&theme.components[name]&&theme.components[name].styleOverrides?theme.components[name].styleOverrides:null,transformVariants=variants=>{const variantsStyles={};return variants&&variants.forEach((definition=>{const key=propsToClassKey(definition.props);variantsStyles[key]=definition.style})),variantsStyles},getVariantStyles=(name,theme)=>{let variants=[];return theme&&theme.components&&theme.components[name]&&theme.components[name].variants&&(variants=theme.components[name].variants),transformVariants(variants)},variantsResolver=(props,styles,variants)=>{const{ownerState={}}=props,variantsStyles=[];return variants&&variants.forEach((variant=>{let isMatch=!0;Object.keys(variant.props).forEach((key=>{ownerState[key]!==variant.props[key]&&props[key]!==variant.props[key]&&(isMatch=!1)})),isMatch&&variantsStyles.push(styles[propsToClassKey(variant.props)])})),variantsStyles},themeVariantsResolver=(props,styles,theme,name)=>{var _theme$components;const themeVariants=null==theme||null==(_theme$components=theme.components)||null==(_theme$components=_theme$components[name])?void 0:_theme$components.variants;return variantsResolver(props,styles,themeVariants)};function shouldForwardProp(prop){return"ownerState"!==prop&&"theme"!==prop&&"sx"!==prop&&"as"!==prop}const systemDefaultTheme=(0,createTheme.Z)(),lowercaseFirstLetter=string=>string?string.charAt(0).toLowerCase()+string.slice(1):string;function resolveTheme({defaultTheme,theme,themeId}){return function createStyled_isEmpty(obj){return 0===Object.keys(obj).length}(theme)?defaultTheme:theme[themeId]||theme}function defaultOverridesResolver(slot){return slot?(props,styles)=>styles[slot]:null}const muiStyledFunctionResolver=({styledArg,props,defaultTheme,themeId})=>{const resolvedStyles=styledArg((0,esm_extends.Z)({},props,{theme:resolveTheme((0,esm_extends.Z)({},props,{defaultTheme,themeId}))}));let optionalVariants;if(resolvedStyles&&resolvedStyles.variants&&(optionalVariants=resolvedStyles.variants,delete resolvedStyles.variants),optionalVariants){return[resolvedStyles,...variantsResolver(props,transformVariants(optionalVariants),optionalVariants)]}return resolvedStyles};function createStyled(input={}){const{themeId,defaultTheme=systemDefaultTheme,rootShouldForwardProp=shouldForwardProp,slotShouldForwardProp=shouldForwardProp}=input,systemSx=props=>(0,styleFunctionSx.Z)((0,esm_extends.Z)({},props,{theme:resolveTheme((0,esm_extends.Z)({},props,{defaultTheme,themeId}))}));return systemSx.__mui_systemSx=!0,(tag,inputOptions={})=>{(0,styled_engine.Co)(tag,(styles=>styles.filter((style=>!(null!=style&&style.__mui_systemSx)))));const{name:componentName,slot:componentSlot,skipVariantsResolver:inputSkipVariantsResolver,skipSx:inputSkipSx,overridesResolver=defaultOverridesResolver(lowercaseFirstLetter(componentSlot))}=inputOptions,options=(0,objectWithoutPropertiesLoose.Z)(inputOptions,createStyled_excluded),skipVariantsResolver=void 0!==inputSkipVariantsResolver?inputSkipVariantsResolver:componentSlot&&"Root"!==componentSlot&&"root"!==componentSlot||!1,skipSx=inputSkipSx||!1;let shouldForwardPropOption=shouldForwardProp;"Root"===componentSlot||"root"===componentSlot?shouldForwardPropOption=rootShouldForwardProp:componentSlot?shouldForwardPropOption=slotShouldForwardProp:function isStringTag(tag){return"string"==typeof tag&&tag.charCodeAt(0)>96}(tag)&&(shouldForwardPropOption=void 0);const defaultStyledResolver=(0,styled_engine.ZP)(tag,(0,esm_extends.Z)({shouldForwardProp:shouldForwardPropOption,label:undefined},options)),muiStyledResolver=(styleArg,...expressions)=>{const expressionsWithDefaultTheme=expressions?expressions.map((stylesArg=>{if("function"==typeof stylesArg&&stylesArg.__emotion_real!==stylesArg)return props=>muiStyledFunctionResolver({styledArg:stylesArg,props,defaultTheme,themeId});if((0,deepmerge.P)(stylesArg)){let styledArgVariants,transformedStylesArg=stylesArg;return stylesArg&&stylesArg.variants&&(styledArgVariants=stylesArg.variants,delete transformedStylesArg.variants,transformedStylesArg=props=>{let result=stylesArg;return variantsResolver(props,transformVariants(styledArgVariants),styledArgVariants).forEach((variantStyle=>{result=(0,deepmerge.Z)(result,variantStyle)})),result}),transformedStylesArg}return stylesArg})):[];let transformedStyleArg=styleArg;if((0,deepmerge.P)(styleArg)){let styledArgVariants;styleArg&&styleArg.variants&&(styledArgVariants=styleArg.variants,delete transformedStyleArg.variants,transformedStyleArg=props=>{let result=styleArg;return variantsResolver(props,transformVariants(styledArgVariants),styledArgVariants).forEach((variantStyle=>{result=(0,deepmerge.Z)(result,variantStyle)})),result})}else"function"==typeof styleArg&&styleArg.__emotion_real!==styleArg&&(transformedStyleArg=props=>muiStyledFunctionResolver({styledArg:styleArg,props,defaultTheme,themeId}));componentName&&overridesResolver&&expressionsWithDefaultTheme.push((props=>{const theme=resolveTheme((0,esm_extends.Z)({},props,{defaultTheme,themeId})),styleOverrides=getStyleOverrides(componentName,theme);if(styleOverrides){const resolvedStyleOverrides={};return Object.entries(styleOverrides).forEach((([slotKey,slotStyle])=>{resolvedStyleOverrides[slotKey]="function"==typeof slotStyle?slotStyle((0,esm_extends.Z)({},props,{theme})):slotStyle})),overridesResolver(props,resolvedStyleOverrides)}return null})),componentName&&!skipVariantsResolver&&expressionsWithDefaultTheme.push((props=>{const theme=resolveTheme((0,esm_extends.Z)({},props,{defaultTheme,themeId}));return themeVariantsResolver(props,getVariantStyles(componentName,theme),theme,componentName)})),skipSx||expressionsWithDefaultTheme.push(systemSx);const numOfCustomFnsApplied=expressionsWithDefaultTheme.length-expressions.length;if(Array.isArray(styleArg)&&numOfCustomFnsApplied>0){const placeholders=new Array(numOfCustomFnsApplied).fill("");transformedStyleArg=[...styleArg,...placeholders],transformedStyleArg.raw=[...styleArg.raw,...placeholders]}const Component=defaultStyledResolver(transformedStyleArg,...expressionsWithDefaultTheme);return tag.muiName&&(Component.muiName=tag.muiName),Component};return defaultStyledResolver.withConfig&&(muiStyledResolver.withConfig=defaultStyledResolver.withConfig),muiStyledResolver}}},"./node_modules/@mui/system/esm/useThemeProps/getThemeProps.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>getThemeProps});var _mui_utils__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@mui/utils/esm/resolveProps.js");function getThemeProps(params){const{theme,name,props}=params;return theme&&theme.components&&theme.components[name]&&theme.components[name].defaultProps?(0,_mui_utils__WEBPACK_IMPORTED_MODULE_0__.Z)(theme.components[name].defaultProps,props):props}},"./node_modules/@mui/system/esm/useThemeProps/useThemeProps.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>useThemeProps});var _getThemeProps__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@mui/system/esm/useThemeProps/getThemeProps.js"),_useTheme__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@mui/system/esm/useTheme.js");function useThemeProps({props,name,defaultTheme,themeId}){let theme=(0,_useTheme__WEBPACK_IMPORTED_MODULE_0__.Z)(defaultTheme);themeId&&(theme=theme[themeId]||theme);return(0,_getThemeProps__WEBPACK_IMPORTED_MODULE_1__.Z)({theme,name,props})}},"./node_modules/@mui/utils/esm/composeClasses/composeClasses.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function composeClasses(slots,getUtilityClass,classes=void 0){const output={};return Object.keys(slots).forEach((slot=>{output[slot]=slots[slot].reduce(((acc,key)=>{if(key){const utilityClass=getUtilityClass(key);""!==utilityClass&&acc.push(utilityClass),classes&&classes[key]&&acc.push(classes[key])}return acc}),[]).join(" ")})),output}__webpack_require__.d(__webpack_exports__,{Z:()=>composeClasses})},"./node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>generateUtilityClass});var _ClassNameGenerator__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@mui/utils/esm/ClassNameGenerator/ClassNameGenerator.js");const globalStateClassesMapping={active:"active",checked:"checked",completed:"completed",disabled:"disabled",error:"error",expanded:"expanded",focused:"focused",focusVisible:"focusVisible",open:"open",readOnly:"readOnly",required:"required",selected:"selected"};function generateUtilityClass(componentName,slot,globalStatePrefix="Mui"){const globalStateClass=globalStateClassesMapping[slot];return globalStateClass?`${globalStatePrefix}-${globalStateClass}`:`${_ClassNameGenerator__WEBPACK_IMPORTED_MODULE_0__.Z.generate(componentName)}-${slot}`}},"./node_modules/@mui/utils/esm/generateUtilityClasses/generateUtilityClasses.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>generateUtilityClasses});var _generateUtilityClass__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js");function generateUtilityClasses(componentName,slots,globalStatePrefix="Mui"){const result={};return slots.forEach((slot=>{result[slot]=(0,_generateUtilityClass__WEBPACK_IMPORTED_MODULE_0__.Z)(componentName,slot,globalStatePrefix)})),result}},"./node_modules/@mui/utils/esm/resolveProps.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{Z:()=>resolveProps});var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/extends.js");function resolveProps(defaultProps,props){const output=(0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__.Z)({},props);return Object.keys(defaultProps).forEach((propName=>{if(propName.toString().match(/^(components|slots)$/))output[propName]=(0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__.Z)({},defaultProps[propName],output[propName]);else if(propName.toString().match(/^(componentsProps|slotProps)$/)){const defaultSlotProps=defaultProps[propName]||{},slotProps=props[propName];output[propName]={},slotProps&&Object.keys(slotProps)?defaultSlotProps&&Object.keys(defaultSlotProps)?(output[propName]=(0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__.Z)({},slotProps),Object.keys(defaultSlotProps).forEach((slotPropName=>{output[propName][slotPropName]=resolveProps(defaultSlotProps[slotPropName],slotProps[slotPropName])}))):output[propName]=slotProps:output[propName]=defaultSlotProps}else void 0===output[propName]&&(output[propName]=defaultProps[propName])})),output}},"./stories/loaders/ClassicLoader.stories.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Classic_Loader:()=>Classic_Loader,default:()=>ClassicLoader_stories});var defineProperty=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/defineProperty.js"),react=__webpack_require__("./node_modules/next/dist/compiled/react/index.js"),Box=__webpack_require__("./node_modules/@mui/material/Box/Box.js"),objectWithoutPropertiesLoose=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js"),esm_extends=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/extends.js"),clsx=__webpack_require__("./node_modules/clsx/dist/clsx.mjs"),composeClasses=__webpack_require__("./node_modules/@mui/utils/esm/composeClasses/composeClasses.js"),emotion_react_browser_esm=__webpack_require__("./node_modules/@emotion/react/dist/emotion-react.browser.esm.js"),capitalize=__webpack_require__("./node_modules/@mui/material/utils/capitalize.js"),useThemeProps=__webpack_require__("./node_modules/@mui/material/styles/useThemeProps.js"),styled=__webpack_require__("./node_modules/@mui/material/styles/styled.js"),generateUtilityClasses=__webpack_require__("./node_modules/@mui/utils/esm/generateUtilityClasses/generateUtilityClasses.js"),generateUtilityClass=__webpack_require__("./node_modules/@mui/utils/esm/generateUtilityClass/generateUtilityClass.js");function getCircularProgressUtilityClass(slot){return(0,generateUtilityClass.Z)("MuiCircularProgress",slot)}const CircularProgress_circularProgressClasses=(0,generateUtilityClasses.Z)("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]);var jsx_runtime=__webpack_require__("./node_modules/next/dist/compiled/react/jsx-runtime.js");const _excluded=["className","color","disableShrink","size","style","thickness","value","variant"];let _t,_t2,_t3,_t4,_=t=>t;const circularRotateKeyframe=(0,emotion_react_browser_esm.F4)(_t||(_t=_`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`)),circularDashKeyframe=(0,emotion_react_browser_esm.F4)(_t2||(_t2=_`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`)),CircularProgressRoot=(0,styled.ZP)("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(props,styles)=>{const{ownerState}=props;return[styles.root,styles[ownerState.variant],styles[`color${(0,capitalize.Z)(ownerState.color)}`]]}})((({ownerState,theme})=>(0,esm_extends.Z)({display:"inline-block"},"determinate"===ownerState.variant&&{transition:theme.transitions.create("transform")},"inherit"!==ownerState.color&&{color:(theme.vars||theme).palette[ownerState.color].main})),(({ownerState})=>"indeterminate"===ownerState.variant&&(0,emotion_react_browser_esm.iv)(_t3||(_t3=_`
      animation: ${0} 1.4s linear infinite;
    `),circularRotateKeyframe))),CircularProgressSVG=(0,styled.ZP)("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(props,styles)=>styles.svg})({display:"block"}),CircularProgressCircle=(0,styled.ZP)("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(props,styles)=>{const{ownerState}=props;return[styles.circle,styles[`circle${(0,capitalize.Z)(ownerState.variant)}`],ownerState.disableShrink&&styles.circleDisableShrink]}})((({ownerState,theme})=>(0,esm_extends.Z)({stroke:"currentColor"},"determinate"===ownerState.variant&&{transition:theme.transitions.create("stroke-dashoffset")},"indeterminate"===ownerState.variant&&{strokeDasharray:"80px, 200px",strokeDashoffset:0})),(({ownerState})=>"indeterminate"===ownerState.variant&&!ownerState.disableShrink&&(0,emotion_react_browser_esm.iv)(_t4||(_t4=_`
      animation: ${0} 1.4s ease-in-out infinite;
    `),circularDashKeyframe))),CircularProgress_CircularProgress=react.forwardRef((function CircularProgress(inProps,ref){const props=(0,useThemeProps.Z)({props:inProps,name:"MuiCircularProgress"}),{className,color="primary",disableShrink=!1,size=40,style,thickness=3.6,value=0,variant="indeterminate"}=props,other=(0,objectWithoutPropertiesLoose.Z)(props,_excluded),ownerState=(0,esm_extends.Z)({},props,{color,disableShrink,size,thickness,value,variant}),classes=(ownerState=>{const{classes,variant,color,disableShrink}=ownerState,slots={root:["root",variant,`color${(0,capitalize.Z)(color)}`],svg:["svg"],circle:["circle",`circle${(0,capitalize.Z)(variant)}`,disableShrink&&"circleDisableShrink"]};return(0,composeClasses.Z)(slots,getCircularProgressUtilityClass,classes)})(ownerState),circleStyle={},rootStyle={},rootProps={};if("determinate"===variant){const circumference=2*Math.PI*((44-thickness)/2);circleStyle.strokeDasharray=circumference.toFixed(3),rootProps["aria-valuenow"]=Math.round(value),circleStyle.strokeDashoffset=`${((100-value)/100*circumference).toFixed(3)}px`,rootStyle.transform="rotate(-90deg)"}return(0,jsx_runtime.jsx)(CircularProgressRoot,(0,esm_extends.Z)({className:(0,clsx.Z)(classes.root,className),style:(0,esm_extends.Z)({width:size,height:size},rootStyle,style),ownerState,ref,role:"progressbar"},rootProps,other,{children:(0,jsx_runtime.jsx)(CircularProgressSVG,{className:classes.svg,ownerState,viewBox:"22 22 44 44",children:(0,jsx_runtime.jsx)(CircularProgressCircle,{className:classes.circle,style:circleStyle,ownerState,cx:44,cy:44,r:(44-thickness)/2,fill:"none",strokeWidth:thickness})})}))}));var __jsx=react.createElement;function ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function _objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ownKeys(Object(t),!0).forEach((function(r){(0,defineProperty.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}var ClassicLoader=function ClassicLoader(props){return props.iconVariant?__jsx(CircularProgress_CircularProgress,{value:props.variant?void 0!==props.value?props.value:80:void 0,variant:props.variant||"indeterminate",disableShrink:void 0===props.disableShrink||props.disableShrink,size:props.size||24,thickness:props.thickness||8,sx:_objectSpread(_objectSpread({},props.sx),{},(0,defineProperty.Z)({color:props.secondaryColor?function(theme){return"light"===theme.palette.mode?props.secondaryColor.lightTheme:props.secondaryColor.darkTheme}:function(theme){return"light"===theme.palette.mode?"#1a90ff":"#308fe8"},animationDuration:props.animationDuration||"600ms",position:"absolute",top:"50%",left:"50%",marginTop:"-12px",marginLeft:"-12px"},"& .".concat(CircularProgress_circularProgressClasses.circle),{strokeLinecap:"round"}))}):__jsx(Box.Z,{sx:_objectSpread(_objectSpread({},props.sx),{},{position:"relative",display:"inline",width:"fit-content",height:"fit-content"})},__jsx(CircularProgress_CircularProgress,{variant:"determinate",size:props.size||24,thickness:props.thickness||4,value:100,sx:{color:props.secondaryColor?function(theme){return"light"===theme.palette.mode?props.secondaryColor.lightTheme:props.secondaryColor.darkTheme}:function(theme){return theme.palette.grey["light"===theme.palette.mode?200:800]}}}),__jsx(CircularProgress_CircularProgress,{variant:props.variant||"indeterminate",size:props.size||24,disableShrink:void 0===props.disableShrink||props.disableShrink,thickness:props.thickness||4,value:props.variant?void 0!==props.value?props.value:80:void 0,sx:(0,defineProperty.Z)({color:props.color?function(theme){return"light"===theme.palette.mode?props.color.lightTheme:props.color.darkTheme}:function(theme){return"light"===theme.palette.mode?"#1a90ff":"#308fe8"},animationDuration:props.animationDuration||"600ms",position:"absolute",left:0},"& .".concat(CircularProgress_circularProgressClasses.circle),{strokeLinecap:"round"})}))};ClassicLoader.__docgenInfo={description:"@IUnknown404I Corporative classic round loader component with many custom options.\r\n@param props\r\n@returns ReactNode component as Loader.",methods:[],displayName:"ClassicLoader",props:{variant:{required:!1,tsType:{name:"union",raw:"'determinate' | 'indeterminate'",elements:[{name:"literal",value:"'determinate'"},{name:"literal",value:"'indeterminate'"}]},description:""},iconVariant:{required:!1,tsType:{name:"boolean"},description:""},size:{required:!1,tsType:{name:"number"},description:""},disableShrink:{required:!1,tsType:{name:"boolean"},description:""},animationDuration:{required:!1,tsType:{name:"string"},description:""},thickness:{required:!1,tsType:{name:"number"},description:""},value:{required:!1,tsType:{name:"number"},description:""},sx:{required:!1,tsType:{name:"SxProps",elements:[{name:"Theme"}],raw:"SxProps<Theme>"},description:""},color:{required:!1,tsType:{name:"signature",type:"object",raw:"{\r\n\tlightTheme: string;\r\n\tdarkTheme: string;\r\n}",signature:{properties:[{key:"lightTheme",value:{name:"string",required:!0}},{key:"darkTheme",value:{name:"string",required:!0}}]}},description:""},secondaryColor:{required:!1,tsType:{name:"signature",type:"object",raw:"{\r\n\tlightTheme: string;\r\n\tdarkTheme: string;\r\n}",signature:{properties:[{key:"lightTheme",value:{name:"string",required:!0}},{key:"darkTheme",value:{name:"string",required:!0}}]}},description:""}}};const loaders_ClassicLoader=ClassicLoader;try{ClassicLoader.displayName="ClassicLoader",ClassicLoader.__docgenInfo={description:"",displayName:"ClassicLoader",props:{variant:{defaultValue:null,description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:'"determinate"'},{value:'"indeterminate"'}]}},iconVariant:{defaultValue:null,description:"",name:"iconVariant",required:!1,type:{name:"boolean"}},size:{defaultValue:null,description:"",name:"size",required:!1,type:{name:"number"}},disableShrink:{defaultValue:null,description:"",name:"disableShrink",required:!1,type:{name:"boolean"}},animationDuration:{defaultValue:null,description:"",name:"animationDuration",required:!1,type:{name:"string"}},thickness:{defaultValue:null,description:"",name:"thickness",required:!1,type:{name:"number"}},value:{defaultValue:null,description:"",name:"value",required:!1,type:{name:"number"}},sx:{defaultValue:null,description:"",name:"sx",required:!1,type:{name:"SxProps<Theme>"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"{ lightTheme: string; darkTheme: string; }"}},secondaryColor:{defaultValue:null,description:"",name:"secondaryColor",required:!1,type:{name:"{ lightTheme: string; darkTheme: string; }"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["components/utils/loaders/ClassicLoader.tsx#ClassicLoader"]={docgenInfo:ClassicLoader.__docgenInfo,name:"ClassicLoader",path:"components/utils/loaders/ClassicLoader.tsx#ClassicLoader"})}catch(__react_docgen_typescript_loader_error){}var _Classic_Loader$param,_Classic_Loader$param2;function ClassicLoader_stories_ownKeys(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);r&&(o=o.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,o)}return t}function ClassicLoader_stories_objectSpread(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?ClassicLoader_stories_ownKeys(Object(t),!0).forEach((function(r){(0,defineProperty.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):ClassicLoader_stories_ownKeys(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}const ClassicLoader_stories={title:"Loaders/Classic",component:loaders_ClassicLoader,tags:["autodocs"]};var Classic_Loader={args:{}};Classic_Loader.parameters=ClassicLoader_stories_objectSpread(ClassicLoader_stories_objectSpread({},Classic_Loader.parameters),{},{docs:ClassicLoader_stories_objectSpread(ClassicLoader_stories_objectSpread({},null===(_Classic_Loader$param=Classic_Loader.parameters)||void 0===_Classic_Loader$param?void 0:_Classic_Loader$param.docs),{},{source:ClassicLoader_stories_objectSpread({originalSource:"{\n  args: {}\n}"},null===(_Classic_Loader$param2=Classic_Loader.parameters)||void 0===_Classic_Loader$param2||null===(_Classic_Loader$param2=_Classic_Loader$param2.docs)||void 0===_Classic_Loader$param2?void 0:_Classic_Loader$param2.source)})})}}]);
//# sourceMappingURL=loaders-ClassicLoader-stories.0c04854b.iframe.bundle.js.map