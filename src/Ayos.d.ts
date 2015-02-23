declare module Ayos.Aspects {
    import IParent = Ayos.Interfaces.IParent;
    class Container extends Element implements IParent {
        constructor(type: string, data: string, htmlId: string, htmlClass: string, htmlStyle: string, isTemplated: boolean, children?: Element[]);
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
        toObject(): any;
        pasteChild(child: Element): void;
        protected canPasteChild(child: Element): boolean;
        private moveChild(fromIndex, toIndex);
    }
}
declare module Ayos.Aspects {
    import IParent = Ayos.Interfaces.IParent;
    class Element {
        protected _type: string;
        protected _data: string;
        protected _htmlId: string;
        protected _htmlClass: string;
        protected _htmlStyle: string;
        protected _isTemplated: boolean;
        constructor(_type: string, _data: string, _htmlId: string, _htmlClass: string, _htmlStyle: string, _isTemplated: boolean);
        protected _editor: any;
        protected _parent: IParent;
        protected _containerData: any;
        type: string;
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
        toObject(): any;
        copy(clipboard: DataTransfer): void;
        cut(clipboard: DataTransfer): void;
        paste(clipboard: DataTransfer): void;
        pasteChild(child: Element): void;
    }
}
declare module Ayos.Aspects {
    import IParent = Ayos.Interfaces.IParent;
    class Wrapper extends Element implements IParent {
        constructor(type: string, data: string, htmlId: string, htmlClass: string, htmlStyle: string, isTemplated: boolean, child?: Element);
        protected _child: Element;
        isTemplated: boolean;
        editor: any;
        child: Element;
        innerText: string;
        isSelected: boolean;
        isSealed: boolean;
        deleteChild(child: Element): void;
        toObject(): any;
        pasteChild(child: Element): void;
        protected canPasteChild(child: Element): boolean;
    }
}
declare module Ayos.Interfaces {
    interface IParent {
        deleteChild(child: Ayos.Aspects.Element): void;
        pasteChild(child: Ayos.Aspects.Element): void;
    }
}
