module Ayos.Services.ElementTypeRegistry
{
    import Element = Ayos.Aspects.Element;
    import ElementBuilderFunc = Ayos.Services.ElementFactory.ElementBuilderFunc;

    export interface IElementType
    {
        name: string;
        category: string;
        icon: string;
        label: string;
        description: string;
        buildFrom: ElementBuilderFunc;
    }

    var elementTypes: IElementType[] = [];

    export function addElementType(elementType: IElementType)
    {
        if (!elementTypes.some((o) => o.name === elementType.name))
            elementTypes.push(elementType);
    }

    export function removeElementType(elementType: IElementType)
    {
        if (elementTypes.some((o) => o.name === elementType.name))
        {
            var existingElementType = elementTypes.filter((o) => o.name === elementType.name)[0];
            var existingElementTypeIndex = elementTypes.indexOf(existingElementType);
            elementTypes.slice(existingElementTypeIndex, 1);
        }
    }

    export function getElementTypeByName(elementTypeName: string)
    {
        var matchingElementTypes = elementTypes.filter((o) => o.name === elementTypeName);
        if (matchingElementTypes.length > 0)
            return matchingElementTypes[0];
        return null;
    }
} 