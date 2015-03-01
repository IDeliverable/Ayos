module Ayos.Services.ElementFactory
{
    import Element = Ayos.Aspects.Element;
    import IElementData = Ayos.Aspects.IElementData;
    import ElementTypeRegistry = Ayos.Services.ElementTypeRegistry;

    export interface ElementBuilderFunc
    {
        (data: IElementData): Element;
    }

    export function createElement(data: IElementData)
    {
        var elementType = ElementTypeRegistry.getElementTypeByName(data.typeName);
        if (!!elementType)
            return elementType.buildFrom(data);
        throw new Error(`The element type '${data.typeName}' has not been registered with the element type registry.`);
    }
} 