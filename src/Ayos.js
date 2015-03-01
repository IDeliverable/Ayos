/// <reference path="typings/jquery.d.ts" />
/// <reference path="typings/jqueryui.d.ts" />
/// <reference path="typings/angular.d.ts" />
/// <reference path="typings/angular-sanitize.d.ts" />
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
            function Container(typeName, data, htmlId, htmlClass, htmlStyle, isTemplated, children) {
                if (children === void 0) { children = []; }
                _super.call(this, typeName, data, htmlId, htmlClass, htmlStyle, isTemplated);
                this.children = children;
            }
            Container.configureScope = function (scope, element) {
                _super.configureScope.call(this, scope, element);
            };
            Container.configureDom = function (scope, element) {
                _super.configureDom.call(this, scope, element);
            };
            Object.defineProperty(Container.prototype, "isTemplated", {
                set: function (value) {
                    this._isTemplated = value;
                    this.children.forEach(function (child) { return child.isTemplated = value; });
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Container.prototype, "editor", {
                set: function (value) {
                    this._editor = value;
                    this.children.forEach(function (child) { return child.editor = value; });
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
                    if (!value)
                        throw new Error("The children property cannot be set to null or undefined.");
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
            Container.prototype.addChild = function (child) {
                if (!child)
                    return;
                if (this.children.indexOf(child) === -1)
                    this.children.push(child);
                child.parent = this;
            };
            Container.prototype.deleteChild = function (child) {
                if (!child)
                    return;
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
                if (!child)
                    return;
                if (this.children.length < 2)
                    return;
                var index = this.children.indexOf(child);
                if (index > 0)
                    this.children[index - 1].isFocused = true;
            };
            Container.prototype.moveFocusNextChild = function (child) {
                if (!child)
                    return;
                if (this.children.length < 2)
                    return;
                var index = this.children.indexOf(child);
                if (index < this.children.length - 1)
                    this.children[index + 1].isFocused = true;
            };
            Container.prototype.insertChild = function (child, afterChild) {
                if (!child)
                    return;
                if (this.children.indexOf(child) > -1) {
                    var index = Math.max(this.children.indexOf(afterChild), 0);
                    this.children.splice(index + 1, 0, child);
                    child.editor = this.editor;
                    child.parent = this;
                }
            };
            Container.prototype.getCanMoveChildUp = function (child) {
                if (!child)
                    return false;
                var index = this.children.indexOf(child);
                return index > 0;
            };
            Container.prototype.getCanMoveChildDown = function (child) {
                if (!child)
                    return false;
                var index = this.children.indexOf(child);
                return index < this.children.length - 1;
            };
            Container.prototype.moveChildUp = function (child) {
                if (!this.getCanMoveChildUp(child))
                    return;
                var index = this.children.indexOf(child);
                this.moveChild(index, index - 1);
            };
            Container.prototype.moveChildDown = function (child) {
                if (!this.getCanMoveChildDown(child))
                    return;
                var index = this.children.indexOf(child);
                this.moveChild(index, index + 1);
            };
            Container.prototype.toObject = function () {
                var result = _super.prototype.toObject.call(this);
                result.children = this.children.map(function (child) { return child.toObject(); });
                return result;
            };
            Container.prototype.pasteChild = function (child) {
                if (!child)
                    return;
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
            function Element(_typeName, _data, _htmlId, _htmlClass, _htmlStyle, _isTemplated) {
                this._typeName = _typeName;
                this._data = _data;
                this._htmlId = _htmlId;
                this._htmlClass = _htmlClass;
                this._htmlStyle = _htmlStyle;
                this._isTemplated = _isTemplated;
            }
            Element.configureScope = function (scope, element) {
            };
            Element.configureDom = function (scope, element) {
            };
            Object.defineProperty(Element.prototype, "typeName", {
                get: function () {
                    return this._typeName;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Element.prototype, "data", {
                get: function () {
                    return this._data;
                },
                set: function (value) {
                    this._data = value;
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
                    if (value)
                        this.editor.focusedElement = this;
                    else
                        this.editor.focusedElement = null;
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
            Object.defineProperty(Element.prototype, "isSealed", {
                get: function () {
                    return this.isTemplated;
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
                    typeName: this._typeName,
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
var Ayos;
(function (Ayos) {
    var Aspects;
    (function (Aspects) {
        var Wrapper = (function (_super) {
            __extends(Wrapper, _super);
            function Wrapper(typeName, data, htmlId, htmlClass, htmlStyle, isTemplated, child) {
                _super.call(this, typeName, data, htmlId, htmlClass, htmlStyle, isTemplated);
                this.child = child;
            }
            Object.defineProperty(Wrapper.prototype, "isTemplated", {
                set: function (value) {
                    this._isTemplated = value;
                    if (!!this.child)
                        this.child.isTemplated = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Wrapper.prototype, "editor", {
                set: function (value) {
                    this._editor = value;
                    if (!!this.child)
                        this.child.editor = value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Wrapper.prototype, "child", {
                get: function () {
                    return this._child;
                },
                set: function (value) {
                    this._child = value;
                    if (!!this._child)
                        this._child.parent = this;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Wrapper.prototype, "innerText", {
                get: function () {
                    return !!this.child ? this.child.innerText : "";
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Wrapper.prototype, "isSelected", {
                get: function () {
                    return this.isFocused || (!!this.child && this.child.isSelected);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Wrapper.prototype, "isSealed", {
                get: function () {
                    return !!this.child && this.child.isTemplated;
                },
                enumerable: true,
                configurable: true
            });
            Wrapper.prototype.deleteChild = function (child) {
                if (!child)
                    return;
                if (this.child === child) {
                    this.child = null;
                    if (child.isActive)
                        child.isActive = false;
                    if (child.isFocused)
                        this.isFocused = true;
                }
            };
            Wrapper.prototype.toObject = function () {
                var result = _super.prototype.toObject.call(this);
                result.child = !!this.child ? this.child.toObject() : null;
                return result;
            };
            Wrapper.prototype.pasteChild = function (child) {
                if (!child)
                    return;
                if (this.canPasteChild(child)) {
                    this.child = child;
                    child.isFocused = true;
                }
                else if (!!this.parent)
                    this.parent.pasteChild(child);
            };
            Wrapper.prototype.canPasteChild = function (child) {
                return !this.child;
            };
            return Wrapper;
        })(Aspects.Element);
        Aspects.Wrapper = Wrapper;
    })(Aspects = Ayos.Aspects || (Ayos.Aspects = {}));
})(Ayos || (Ayos = {}));
var Ayos;
(function (Ayos) {
    var Elements;
    (function (Elements) {
        var Stack;
        (function (_Stack) {
            var ElementTypeRegistry = Ayos.Services.ElementTypeRegistry;
            var ElementFactory = Ayos.Services.ElementFactory;
            var Container = Ayos.Aspects.Container;
            var Stack = (function (_super) {
                __extends(Stack, _super);
                function Stack() {
                    _super.apply(this, arguments);
                }
                Stack.configureScope = function (scope, element) {
                    _super.configureScope.call(this, scope, element);
                };
                Stack.configureDom = function (scope, element) {
                    _super.configureDom.call(this, scope, element);
                };
                return Stack;
            })(Container);
            _Stack.Stack = Stack;
            // Register the element type.
            ElementTypeRegistry.addElementType({
                name: "Ayos.Elements.Stack",
                category: "Layout",
                icon: "",
                label: "Stack",
                description: "A container which lays out an infinite number of children in a top-to-bottom vertical stack.",
                buildFrom: function (data) { return new Stack(data.typeName, data.data, data.htmlId, data.htmlClass, data.htmlStyle, data.isTemplated, data.children.map(function (childElementData) { return ElementFactory.createElement(childElementData); })); }
            });
            // Register the directive.
            angular.module("Ayos").directive("ayosStack", function () {
                var directive = {
                    restrict: "E",
                    scope: { element: "=" },
                    controller: ["$scope", "$element", function ($scope, $element) {
                        Stack.configureScope($scope, $element);
                        Stack.configureDom($scope, $element);
                    }],
                    templateUrl: "Stack.html",
                    replace: true
                };
                return directive;
            });
        })(Stack = Elements.Stack || (Elements.Stack = {}));
    })(Elements = Ayos.Elements || (Ayos.Elements = {}));
})(Ayos || (Ayos = {}));
var Ayos;
(function (Ayos) {
    var Services;
    (function (Services) {
        var ElementFactory;
        (function (ElementFactory) {
            var ElementTypeRegistry = Ayos.Services.ElementTypeRegistry;
            function createElement(data) {
                var elementType = ElementTypeRegistry.getElementTypeByName(data.typeName);
                if (!!elementType)
                    return elementType.buildFrom(data);
                throw new Error("The element type '" + data.typeName + "' has not been registered with the element type registry.");
            }
            ElementFactory.createElement = createElement;
        })(ElementFactory = Services.ElementFactory || (Services.ElementFactory = {}));
    })(Services = Ayos.Services || (Ayos.Services = {}));
})(Ayos || (Ayos = {}));
var Ayos;
(function (Ayos) {
    var Services;
    (function (Services) {
        var ElementTypeRegistry;
        (function (ElementTypeRegistry) {
            var elementTypes = [];
            function addElementType(elementType) {
                if (!elementTypes.some(function (o) { return o.name === elementType.name; }))
                    elementTypes.push(elementType);
            }
            ElementTypeRegistry.addElementType = addElementType;
            function removeElementType(elementType) {
                if (elementTypes.some(function (o) { return o.name === elementType.name; })) {
                    var existingElementType = elementTypes.filter(function (o) { return o.name === elementType.name; })[0];
                    var existingElementTypeIndex = elementTypes.indexOf(existingElementType);
                    elementTypes.slice(existingElementTypeIndex, 1);
                }
            }
            ElementTypeRegistry.removeElementType = removeElementType;
            function getElementTypeByName(elementTypeName) {
                var matchingElementTypes = elementTypes.filter(function (o) { return o.name === elementTypeName; });
                if (matchingElementTypes.length > 0)
                    return matchingElementTypes[0];
                return null;
            }
            ElementTypeRegistry.getElementTypeByName = getElementTypeByName;
        })(ElementTypeRegistry = Services.ElementTypeRegistry || (Services.ElementTypeRegistry = {}));
    })(Services = Ayos.Services || (Ayos.Services = {}));
})(Ayos || (Ayos = {}));
//# sourceMappingURL=Ayos.js.map