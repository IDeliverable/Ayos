module Ayos.Aspects
{
    import IParent = Ayos.Interfaces.IParent;

    export class Wrapper extends Element implements IParent
    {
        constructor(
            type: string,
            data: string,
            htmlId: string,
            htmlClass: string,
            htmlStyle: string,
            isTemplated: boolean,
            child?: Element)
        {
            super(type, data, htmlId, htmlClass, htmlStyle, isTemplated);
            this.child = child;
        }

        protected _child: Element;

        set isTemplated(value: boolean)
        {
            this._isTemplated = value;
            if (!!this.child)
                this.child.isTemplated = value;
        }

        set editor(value: any)
        {
            this._editor = value;
            if (!!this.child)
                this.child.editor = value;
        }

        get child()
        {
            return this._child;
        }

        set child(value: Element)
        {
            this._child = value;
            if (!!this._child)
                this._child.parent = this;
        }

        get innerText()
        {
            return !!this.child ? this.child.innerText : "";
        }

        get isSelected()
        {
            return this.isFocused || (!!this.child && this.child.isSelected);
        }

        get isSealed()
        {
            return !!this.child && this.child.isTemplated;
        }

        deleteChild(child: Element)
        {
            if (!child)
                return;
            if (this.child === child)
            {
                this.child = null;
                if (child.isActive)
                    child.isActive = false;
                if (child.isFocused)
                    this.isFocused = true;
            }
        }

        toObject()
        {
            var result = super.toObject();
            result.child = !!this.child ? this.child.toObject() : null;
            return result;
        }

        pasteChild(child: Element)
        {
            if (!child)
                return;
            if (this.canPasteChild(child))
            {
                this.child = child;
                child.isFocused = true;
            }
            else if (!!this.parent)
                this.parent.pasteChild(child);
        }

        protected canPasteChild(child: Element)
        {
            return !this.child;
        }
    }
} 