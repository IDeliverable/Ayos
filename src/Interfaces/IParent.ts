module Ayos.Interfaces
{
    export interface IParent
    {
        deleteChild(child: Ayos.Aspects.Element): void;
        pasteChild(child: Ayos.Aspects.Element): void;
    }
} 