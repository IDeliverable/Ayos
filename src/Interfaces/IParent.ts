module Ayos.Interfaces
{
    /*
     * Represents an API by which a child element can interact with its parent.
     */
    export interface IParent
    {
        deleteChild(child: Ayos.Aspects.Element): void;
        pasteChild(child: Ayos.Aspects.Element): void;
    }
} 