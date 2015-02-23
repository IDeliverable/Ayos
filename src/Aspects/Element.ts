module Ayos.Aspects
{
    import IParent = Ayos.Interfaces.IParent;

    export class Element
    {
        constructor(
            protected _type: string,
            protected _data: string,
            protected _htmlId: string,
            protected _htmlClass: string,
            protected _htmlStyle: string,
            protected _isTemplated: boolean)
        {
        }

        protected _editor: any; // TODO: Specify type.
        protected _parent: IParent;
        protected _containerData: any;

        get type()
        {
            return this._type;
        }

        get isTemplated()
        {
            return this._isTemplated;
        }

        set isTemplated(value: boolean)
        {
            this._isTemplated = value;
        }

        get editor(): any
        {
            return this._editor;
        }

        set editor(value: any)
        {
            this._editor = value;
        }

        get parent()
        {
            return this._parent;
        }

        set parent(value: IParent)
        {
            this._parent = value;
        }

        protected get containerData(): any
        {
            return this._containerData;
        }

        protected set containerData(value: any)
        {
            this._containerData = value;
        }

        get isActive()
        {
            if (!this.editor)
                return false;
            return this.editor.activeElement === this;
        }

        set isActive(value: boolean)
        {
            if (!this.editor)
                return;
            if (this.editor.isDragging || this.editor.inlineEditingIsActive || this.editor.isResizing)
                return;

            if (value)
                this.editor.activeElement = this;
            else
                this.editor.activeElement = this.parent;
        }

        get isFocused()
        {
            if (!this.editor)
                return false;
            return this.editor.focusedElement === this;
        }

        set isFocused(value: boolean)
        {
            if (!this.editor)
                return;
            if (this.isTemplated)
                return;
            if (this.editor.isDragging || this.editor.inlineEditingIsActive || this.editor.isResizing)
                return;

            this.editor.focusedElement = this;
            //_(this.setIsFocusedEventHandlers).each(function (item)
            //{
            //    try {
            //        item();
            //    }
            //    catch (ex)
            //    {
            //        // Ignore.
            //    }
            //});
        }

        get isSelected()
        {
            return this.isFocused;
        }

        get isDropTarget()
        {
            if (!this.editor)
                return false;
            return this.editor.dropTargetElement === this;
        }

        set isDropTarget(value: boolean)
        {
            if (!this.editor)
                return;
            if (value)
                this.editor.dropTargetElement = this;
            else
                this.editor.dropTargetElement = null;
        }

        //get canMoveUp()
        //{
        //    if (!this.parent)
        //        return false;
        //    return this.parent.canMoveChildUp(this);
        //}

        //get canMoveDown()
        //{
        //    if (!this.parent)
        //        return false;
        //    return this.parent.canMoveChildDown(this);
        //}

        get innerText(): string
        {
            throw new Error("This property accessor is abstract.");
        }

        //moveUp()
        //{
        //    if (!!this.parent)
        //        this.parent.moveChildUp(this);
        //}

        //moveDown()
        //{
        //    if (!!this.parent)
        //        this.parent.moveChildDown(this);
        //}

        //delete()
        //{
        //    if (!!this.parent)
        //        this.parent.deleteChild(this);
        //}

        toObject(): any
        {
            return {
                type: this._type,
                data: this._data,
                htmlId: this._htmlId,
                htmlClass: this._htmlClass,
                htmlStyle: this._htmlStyle,
                isTemplated: this.isTemplated
            };
        }

        copy(clipboard: DataTransfer)
        {
            var text = this.innerText;
            clipboard.setData("text/plain", text);

            var data = this.toObject();
            var json = JSON.stringify(data, null, "\t");
            clipboard.setData("text/json", json);
        }

        cut(clipboard: DataTransfer)
        {
            this.copy(clipboardData);
            this.parent.deleteChild(this);
        }

        paste(clipboard: DataTransfer)
        {
            var json = clipboardData.getData("text/json");
            if (!!json)
            {
                var data = JSON.parse(json);
                var child: Element;
                //var child = LayoutEditor.elementFrom(data); // TODO: Implement.
                this.pasteChild(child);
            }
        }

        pasteChild(child: Element)
        {
            if (!!this.parent)
                this.parent.pasteChild(child);
        }
    }
}