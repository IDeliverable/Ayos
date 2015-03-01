module Ayos.Elements.Stack
{
    import ElementTypeRegistry = Ayos.Services.ElementTypeRegistry;
    import ElementFactory = Ayos.Services.ElementFactory;
    import IElementType = ElementTypeRegistry.IElementType;
    import IContainerData = Ayos.Aspects.IContainerData;
    import IContainerScope = Ayos.Aspects.IContainerScope;
    import Container = Ayos.Aspects.Container;

    export interface IStackData extends IContainerData
    {
    }

    export interface IStackScope extends IContainerScope
    {
    }

    export class Stack extends Container
    {
        static configureScope(scope: IStackScope, element: ng.IAugmentedJQuery)
        {
            super.configureScope(scope, element);
        }

        static configureDom(scope: IStackScope, element: ng.IAugmentedJQuery)
        {
            super.configureDom(scope, element);
        }
    }

    // Register the element type.
    ElementTypeRegistry.addElementType({
        name: "Ayos.Elements.Stack",
        category: "Layout",
        icon: "",
        label: "Stack",
        description: "A container which lays out an infinite number of children in a top-to-bottom vertical stack.",
        buildFrom: (data: IContainerData) => new Stack(data.typeName, data.data, data.htmlId, data.htmlClass, data.htmlStyle, data.isTemplated, data.children.map((childElementData) => ElementFactory.createElement(childElementData)))
    });

    // Register the directive.
    angular.module("Ayos").directive("ayosStack", () =>
    {     
        var directive: ng.IDirective = {
            restrict: "E",
            scope: { element: "=" },
            controller: ["$scope", "$element", ($scope: ng.IScope, $element: ng.IAugmentedJQuery) =>
            {
                Stack.configureScope($scope, $element);
                Stack.configureDom($scope, $element);
            }],
            templateUrl: "Stack.html",
            replace: true
        };

        return directive;
    });
}