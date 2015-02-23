var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Ayos;
(function (Ayos) {
    var Aspects;
    (function (Aspects) {
        var Container = (function (_super) {
            __extends(Container, _super);
            function Container(type, data, htmlId, htmlClass, htmlStyle, isTemplated, children) {
                if (children === void 0) { children = []; }
                _super.call(this, type, data, htmlId, htmlClass, htmlStyle, isTemplated);
                this._children = children;
            }
            Object.defineProperty(Container.prototype, "isTemplated", {
                set: function (value) {
                    this._isTemplated = value;
                    this._children.forEach(function (child) { return child.isTemplated = value; });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Container.prototype, "editor", {
                set: function (value) {
                    this._editor = value;
                    this._children.forEach(function (child) { return child.editor = value; });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Container.prototype, "isSelected", {
                get: function () {
                    return this.isFocused || this.children.some(function (child) { return child.isSelected; });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Container.prototype, "isSealed", {
                get: function () {
                    return this.children.some(function (child) { return child.isTemplated; });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Container.prototype, "children", {
                get: function () {
                    return this._children;
                },
                set: function (value) {
                    var _this = this;
                    this._children = value;
                    this._children.forEach(function (child) { return child.parent = _this; });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Container.prototype, "innerText", {
                get: function () {
                    return this.children.map(function (child) { return child.innerText; }).reduce(function (previous, current) { return ("" + previous + "\n" + current); });
                },
                enumerable: true,
                configurable: true
            });
            Container.prototype.addChild = function (child) {
                if (this.children.indexOf(child) === -1)
                    this.children.push(child);
                child.parent = this;
            };
            Container.prototype.deleteChild = function (child) {
                var index = this.children.indexOf(child);
                if (index > -1) {
                    this.children.splice(index, 1);
                    if (child.isActive)
                        this.editor.activeElement = null;
                    if (child.isFocused) {
                        // If the deleted child was focused, try to set new focus to the most appropriate sibling or parent.
                        if (this.children.length > index)
                            this.children[index].isFocused = true;
                        else if (index > 0)
                            this.children[index - 1].isFocused = true;
                        else
                            this.isFocused = true;
                    }
                }
            };
            Container.prototype.moveFocusPrevChild = function (child) {
                if (this.children.length < 2)
                    return;
                var index = this.children.indexOf(child);
                if (index > 0)
                    this.children[index - 1].isFocused = true;
            };
            Container.prototype.moveFocusNextChild = function (child) {
                if (this.children.length < 2)
                    return;
                var index = this.children.indexOf(child);
                if (index < this.children.length - 1)
                    this.children[index + 1].isFocused = true;
            };
            Container.prototype.insertChild = function (child, afterChild) {
                if (this.children.indexOf(child) > -1) {
                    var index = Math.max(this.children.indexOf(afterChild), 0);
                    this.children.splice(index + 1, 0, child);
                    child.editor = this.editor;
                    child.parent = this;
                }
            };
            Container.prototype.moveChildUp = function (child) {
                if (!this.canMoveChildUp(child))
                    return;
                var index = this.children.indexOf(child);
                this.moveChild(index, index - 1);
            };
            Container.prototype.moveChildDown = function (child) {
                if (!this.canMoveChildDown(child))
                    return;
                var index = this.children.indexOf(child);
                this.moveChild(index, index + 1);
            };
            Container.prototype.canMoveChildUp = function (child) {
                var index = this.children.indexOf(child);
                return index > 0;
            };
            Container.prototype.canMoveChildDown = function (child) {
                var index = this.children.indexOf(child);
                return index < this.children.length - 1;
            };
            Container.prototype.toObject = function () {
                var result = _super.prototype.toObject.call(this);
                result.children = this.children.map(function (child) { return child.toObject(); });
                return result;
            };
            Container.prototype.pasteChild = function (child) {
                if (this.canPasteChild(child)) {
                    this.addChild(child);
                    child.isFocused = true;
                }
                else if (!!this.parent)
                    this.parent.pasteChild(child);
            };
            Container.prototype.canPasteChild = function (child) {
                return this.children.indexOf(child) === -1;
            };
            Container.prototype.moveChild = function (fromIndex, toIndex) {
                this.children.splice(toIndex, 0, this.children.splice(fromIndex, 1)[0]);
            };
            return Container;
        })(Aspects.Element);
        Aspects.Container = Container;
    })(Aspects = Ayos.Aspects || (Ayos.Aspects = {}));
})(Ayos || (Ayos = {}));
var Ayos;
(function (Ayos) {
    var Aspects;
    (function (Aspects) {
        var Element = (function () {
            function Element(_type, _data, _htmlId, _htmlClass, _htmlStyle, _isTemplated) {
                this._type = _type;
                this._data = _data;
                this._htmlId = _htmlId;
                this._htmlClass = _htmlClass;
                this._htmlStyle = _htmlStyle;
                this._isTemplated = _isTemplated;
            }
            Object.defineProperty(Element.prototype, "type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "isTemplated", {
                get: function () {
                    return this._isTemplated;
                },
                set: function (value) {
                    this._isTemplated = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "editor", {
                get: function () {
                    return this._editor;
                },
                set: function (value) {
                    this._editor = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "parent", {
                get: function () {
                    return this._parent;
                },
                set: function (value) {
                    this._parent = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "containerData", {
                get: function () {
                    return this._containerData;
                },
                set: function (value) {
                    this._containerData = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "isActive", {
                get: function () {
                    if (!this.editor)
                        return false;
                    return this.editor.activeElement === this;
                },
                set: function (value) {
                    if (!this.editor)
                        return;
                    if (this.editor.isDragging || this.editor.inlineEditingIsActive || this.editor.isResizing)
                        return;
                    if (value)
                        this.editor.activeElement = this;
                    else
                        this.editor.activeElement = this.parent;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "isFocused", {
                get: function () {
                    if (!this.editor)
                        return false;
                    return this.editor.focusedElement === this;
                },
                set: function (value) {
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
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "isSelected", {
                get: function () {
                    return this.isFocused;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "isDropTarget", {
                get: function () {
                    if (!this.editor)
                        return false;
                    return this.editor.dropTargetElement === this;
                },
                set: function (value) {
                    if (!this.editor)
                        return;
                    if (value)
                        this.editor.dropTargetElement = this;
                    else
                        this.editor.dropTargetElement = null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "innerText", {
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
                get: function () {
                    throw new Error("This property accessor is abstract.");
                },
                enumerable: true,
                configurable: true
            });
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
            Element.prototype.toObject = function () {
                return {
                    type: this._type,
                    data: this._data,
                    htmlId: this._htmlId,
                    htmlClass: this._htmlClass,
                    htmlStyle: this._htmlStyle,
                    isTemplated: this.isTemplated
                };
            };
            Element.prototype.copy = function (clipboard) {
                var text = this.innerText;
                clipboard.setData("text/plain", text);
                var data = this.toObject();
                var json = JSON.stringify(data, null, "\t");
                clipboard.setData("text/json", json);
            };
            Element.prototype.cut = function (clipboard) {
                this.copy(clipboardData);
                this.parent.deleteChild(this);
            };
            Element.prototype.paste = function (clipboard) {
                var json = clipboardData.getData("text/json");
                if (!!json) {
                    var data = JSON.parse(json);
                    var child;
                    //var child = LayoutEditor.elementFrom(data); // TODO: Implement.
                    this.pasteChild(child);
                }
            };
            Element.prototype.pasteChild = function (child) {
                if (!!this.parent)
                    this.parent.pasteChild(child);
            };
            return Element;
        })();
        Aspects.Element = Element;
    })(Aspects = Ayos.Aspects || (Ayos.Aspects = {}));
})(Ayos || (Ayos = {}));
//# sourceMappingURL=Ayos.js.map