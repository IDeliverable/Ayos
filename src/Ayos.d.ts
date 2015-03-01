/// <reference path="Typings/jquery.d.ts" />
/// <reference path="Typings/jqueryui.d.ts" />
/// <reference path="Typings/angular.d.ts" />
/// <reference path="Typings/angular-sanitize.d.ts" />
declare module Ayos.Aspects {
    import IParent = Ayos.Interfaces.IParent;
    interface IContainerData extends IElementData {
        children: IElementData[];
    }
    interface IContainerScope extends IElementScope {
    }
    class Container extends Element implements IParent {
        static configureScope(scope: IContainerScope, element: ng.IAugmentedJQuery): void;
        static configureDom(scope: IContainerScope, element: ng.IAugmentedJQuery): void;
        constructor(typeName: string, data: string, htmlId: string, htmlClass: string, htmlStyle: string, isTemplated: boolean, children?: Element[]);
        protected _children: Element[];
        isTemplated: boolean;
        editor: any;
        children: Element[];
        innerText: string;
        isSelected: boolean;
        isSealed: boolean;
        addChild(child: Element): void;
        deleteChild(child: Element): void;
        moveFocusPrevChild(child: Element): void;
        moveFocusNextChild(child: Element): void;
        insertChild(child: Element, afterChild: Element): void;
        getCanMoveChildUp(child: Element): boolean;
        getCanMoveChildDown(child: Element): boolean;
        moveChildUp(child: Element): void;
        moveChildDown(child: Element): void;
        toObject(): IContainerData;
        pasteChild(child: Element): void;
        protected canPasteChild(child: Element): boolean;
        private moveChild(fromIndex, toIndex);
    }
}
declare module Ayos.Aspects {
    import IParent = Ayos.Interfaces.IParent;
    interface IElementData {
        typeName: string;
        data: any;
        htmlId: string;
        htmlClass: string;
        htmlStyle: string;
        isTemplated: boolean;
    }
    interface IElementScope extends ng.IScope {
    }
    class Element {
        protected _typeName: string;
        protected _data: string;
        protected _htmlId: string;
        protected _htmlClass: string;
        protected _htmlStyle: string;
        protected _isTemplated: boolean;
        static configureScope(scope: IElementScope, element: ng.IAugmentedJQuery): void;
        static configureDom(scope: IElementScope, element: ng.IAugmentedJQuery): void;
        constructor(_typeName: string, _data: string, _htmlId: string, _htmlClass: string, _htmlStyle: string, _isTemplated: boolean);
        protected _editor: any;
        protected _parent: IParent;
        protected _containerData: any;
        typeName: string;
        data: string;
        isTemplated: boolean;
        editor: any;
        parent: IParent;
        protected containerData: any;
        isActive: boolean;
        isFocused: boolean;
        isSelected: boolean;
        isDropTarget: boolean;
        isSealed: boolean;
        innerText: string;
        toObject(): IElementData;
        copy(clipboard: DataTransfer): void;
        cut(clipboard: DataTransfer): void;
        paste(clipboard: DataTransfer): void;
        pasteChild(child: Element): void;
    }
}
declare module Ayos.Aspects {
    import IParent = Ayos.Interfaces.IParent;
    interface IWrapperData extends IElementData {
        child: IElementData;
    }
    class Wrapper extends Element implements IParent {
        constructor(typeName: string, data: string, htmlId: string, htmlClass: string, htmlStyle: string, isTemplated: boolean, child?: Element);
        protected _child: Element;
        isTemplated: boolean;
        editor: any;
        child: Element;
        innerText: string;
        isSelected: boolean;
        isSealed: boolean;
        deleteChild(child: Element): void;
        toObject(): IWrapperData;
        pasteChild(child: Element): void;
        protected canPasteChild(child: Element): boolean;
    }
}
declare module Ayos.Elements.Stack {
    import IContainerData = Ayos.Aspects.IContainerData;
    import IContainerScope = Ayos.Aspects.IContainerScope;
    import Container = Ayos.Aspects.Container;
    interface IStackData extends IContainerData {
    }
    interface IStackScope extends IContainerScope {
    }
    class Stack extends Container {
        static configureScope(scope: IStackScope, element: ng.IAugmentedJQuery): void;
        static configureDom(scope: IStackScope, element: ng.IAugmentedJQuery): void;
    }
}
declare module Ayos.Interfaces {
    interface IParent {
        deleteChild(child: Ayos.Aspects.Element): void;
        pasteChild(child: Ayos.Aspects.Element): void;
    }
}
declare module Ayos.Services.ElementFactory {
    import Element = Ayos.Aspects.Element;
    import IElementData = Ayos.Aspects.IElementData;
    interface ElementBuilderFunc {
        (data: IElementData): Element;
    }
    function createElement(data: IElementData): Element;
}
declare module Ayos.Services.ElementTypeRegistry {
    import ElementBuilderFunc = Ayos.Services.ElementFactory.ElementBuilderFunc;
    interface IElementType {
        name: string;
        category: string;
        icon: string;
        label: string;
        description: string;
        buildFrom: ElementBuilderFunc;
    }
    function addElementType(elementType: IElementType): void;
    function removeElementType(elementType: IElementType): void;
    function getElementTypeByName(elementTypeName: string): IElementType;
}
