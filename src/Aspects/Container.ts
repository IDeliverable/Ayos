module Ayos.Aspects
{
    import IParent = Ayos.Interfaces.IParent;

    export class Container extends Element implements IParent
    {
        constructor(
            type: string,
            data: string,
            htmlId: string,
            htmlClass: string,
            htmlStyle: string,
            isTemplated: boolean,
            children: Element[] = [])
        {
            super(type, data, htmlId, htmlClass, htmlStyle, isTemplated);
            this.children = children;
        }

        protected _children: Element[];

        set isTemplated(value: boolean)
        {
            this._isTemplated = value;
            this.children.forEach((child) => child.isTemplated = value);
        }

        set editor(value: any)
        {
            this._editor = value;
            this.children.forEach((child) => child.editor = value);
        }

        get children()
        {
            return this._children;
        }

        set children(value: Element[])
        {
            if (!value)
                throw new Error("The children property cannot be set to null or undefined.");
            this._children = value;
            this._children.forEach(child => child.parent = this);
        }

        get innerText()
        {
            return this.children
                .map((child) => child.innerText)
                .reduce((previous, current) => `${previous}\n${current}`);
        }

        get isSelected()
        {
            return this.isFocused || this.children.some((child) => child.isSelected);
        }

        get isSealed()
        {
            return this.children.some(child => child.isTemplated);
        }

        addChild(child: Element)
        {
            if (!child)
                return;
            if (this.children.indexOf(child) === -1)
                this.children.push(child);
            child.parent = this;
        }

        deleteChild(child: Element)
        {
            if (!child)
                return;
            var index = this.children.indexOf(child);
            if (index > -1)
            {
                this.children.splice(index, 1);
                if (child.isActive)
                    this.editor.activeElement = null;
                if (child.isFocused)
                {
                    // If the deleted child was focused, try to set new focus to the most appropriate sibling or parent.
                    if (this.children.length > index)
                        this.children[index].isFocused = true;
                    else if (index > 0)
                        this.children[index - 1].isFocused = true;
                    else
                        this.isFocused = true;
                }
            }
        }

        moveFocusPrevChild(child: Element)
        {
            if (!child)
                return;
            if (this.children.length < 2)
                return;
            var index = this.children.indexOf(child);
            if (index > 0)
                this.children[index - 1].isFocused = true;
        }

        moveFocusNextChild(child: Element)
        {
            if (!child)
                return;
            if (this.children.length < 2)
                return;
            var index = this.children.indexOf(child);
            if (index < this.children.length - 1)
                this.children[index + 1].isFocused = true;
        }

        insertChild(child: Element, afterChild: Element)
        {
            if (!child)
                return;
            if (this.children.indexOf(child) > -1)
            {
                var index = Math.max(this.children.indexOf(afterChild), 0);
                this.children.splice(index + 1, 0, child);
                child.editor = this.editor;
                child.parent = this;
            }
        }

        getCanMoveChildUp(child: Element)
        {
            if (!child)
                return false;
            var index = this.children.indexOf(child);
            return index > 0;
        }

        getCanMoveChildDown(child: Element)
        {
            if (!child)
                return false;
            var index = this.children.indexOf(child);
            return index < this.children.length - 1;
        }

        moveChildUp(child: Element)
        {
            if (!this.getCanMoveChildUp(child))
                return;
            var index = this.children.indexOf(child);
            this.moveChild(index, index - 1);
        }

        moveChildDown(child: Element)
        {
            if (!this.getCanMoveChildDown(child))
                return;
            var index = this.children.indexOf(child);
            this.moveChild(index, index + 1);
        }

        toObject()
        {
            var result = super.toObject();
            result.children = this.children.map((child) => child.toObject());
            return result;
        }

        pasteChild(child: Element)
        {
            if (!child)
                return;
            if (this.canPasteChild(child))
            {
                this.addChild(child);
                child.isFocused = true;
            }
            else if (!!this.parent)
                this.parent.pasteChild(child);
        }

        protected canPasteChild(child: Element)
        {
            return this.children.indexOf(child) === -1;
        }

        private moveChild(fromIndex: number, toIndex: number)
        {
            this.children.splice(toIndex, 0, this.children.splice(fromIndex, 1)[0]);
        }
    }
} 