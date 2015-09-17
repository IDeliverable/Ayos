# Ayos

Ayos is a project (it this point mostly an idea, really) which aims to build an open-source, fully extensible and customizable, browser-based **visual layout editor component** for use in content management systems or other web-based applications where end-user layout editing capabilities are needed.

## Background

The idea was conceived while I was building the browser-based layout editor for the Orchard CMS (which shipped as the Orchard.Layouts module in version 1.9). When I build something from scratch I often start out building one thing and while doing it realize what I should really be building. Orchard.Layouts was no exception; while working on it I gradually realized more and more things that could and should be done differently. Many of which would require a complete rewrite of the editor from scratch, but of course time and scope constraints made such a reboot imposssible within the context of Orchard.Layouts.

I also realized that what I was building could be very useful beyond Orchard. And so I eventually decided to finish up Orchard.Layouts and then get to work building what I **really** want to build, which is a general-purpose browser-based visual layout editor component that is self-contained, portable, flexible, extensible and customizable enough to be easily integrated into **any** content management system, or for that matter, any other web application.

While working on Orchard.Layouts I also felt extremely bogged down by the lack of strong typing. In the Orchard development team there has been some scepticism to standardizing on TypeScript. Ever since the first time I did any serious TypeScript development a few years ago, writing code in plain JavaScript (i.e. EcmaScript 5) has seemed an utterly pointless exercise, extremely frustrating, error-prone, tedious and generally unproductive. Once you go TypeScript, you ain't never going back. This further added to my reasons for wanting to build Ayos as its own open-source project, where I would be free to use the best technology stack and toolset for the job. The result would be compiled down to plain JavaScript anyway, which could later at some point be included in Orchard as an external dependency library (like jQuery or Knockout).

## Key features

The main differences between Ayos and Orchard.Layouts are:

- Ayos will not asssume any particular host.
- Ayos will be a completely self-contained web component, hostable in any web application context.
- Ayos as a component will be encapsulated and portable, allowing it to exist in multiple instances on the same web page, with different configurations.
- Ayos will not have a notion of server-side API or layout data persistence (it will however have an API for integrating with any such services).
- Ayos will be fully extensible. Every built-in element will itself be a consumer of the same extensibility.
- Ayos will be customizable, i.e. there will be a rich and explicit API to control its behavior.
- Ayos will be skinnable, i.e. the visual styling of the editor will be separated into the concept of a skin. Ayos will provide a default skin. This skin will not look like Orchard. :)
- The Ayos container model will be vastly simplified (more on that below).
- Ayos will be built 100% in TypeScript.
- As enabled by TypeScript, Ayos will be highly object-oriented.

## Simplified container model

In essense, I believe we could rationalize away some elements compared to Orchard.Layouts:
 
* The `Grid` element goes away. It does nothing, adds nothing. It contains no logic, no rules, no special interactions or behaviors, no special appearance. It just sits there as a completely dumb and passive container between a row and everything else. It has no equivalent in Bootstrap either.
* The `Column` element also goes away. It is unnecessary; it adds complexity both for user and implementation. The `Row` element can handle everything, including rendering the necessary Bootstrap column element wrappers for all its children.
                          
To elaborate on how this is possible:
 
We can achieve this by implementing a cleaner and more generic approach, where it is every container's responsibility to handle the layout of its children, according to the semantics and rules of the container. It can do this by attaching container-specific data and behavior to the children (much like attached properties in WPF). The children are blissfully unaware of how they are laid out, or which type of container they happen to reside in.
 
This means that child elements will simply need to exist and worry about their own business, and not concern themselves with how they are laid out or in which type of container they are hosted. The responsibility shifts instead to the container which needs to:
 
- Lay out its children according to the semantics of the container. For example, a `Stack` container lays out children in a simple vertical infinite growing flow, while a `Row` container lays out children horizontally over 12 columns.
- Render layout-specific wrapper elements for all its children, and attach layout manipulation adornment and behavior to those wrapper elements (such as drag and drop, resizing, etc).
- Store container-specific data/state attached to each child. This could be implemented by a property `Element.containerData: any` which containers can use to store their own data/state about the layout of each child.
- Add container-specific properties and corresponding UI to children. For example, the `Row` container would add `Width` and `Offset` properties and contribute input fields to the children popup UIs to edit those properties.
- Add container-specific actions to children. For example, the `Row` container would add `Move Left`, `Move Right`, `Increase Offset`, `Decrease Offset` etc. to its children.
 
The element class hierarchy would look something like this:
 
- **Element** (abstract; contains all general element state and behavior)
	- **Wrapper** (abstract; adds the capability of having exactly ONE child element)
		- **Form** (a special type of wrapper used to add form configuration and behavior)
		- **Editor** (a special type of wrapper used to represent the root of the element tree)
	- **Container** (abstract; adds the capability of having multiple children)
		- **Stack** (adds capability to lay out children in a vertical infinitely growing stack, as well as optionally floating elements left or right; replaces the current Canvas, Grid and Column elements)
		- **Row** (adds capability to lay out children in a horizontal 12-column grid system; limits the number of children to 12)
		- **Responsive Row** (adds capability to lay out children in a horizontal row where each child can be configured with width and visibility for a given range of viewport widths; can render appropriate markup for different responsive frameworks, e.g. Bootstrap, Zurb Foundation; children can wrap to multiple lines)
		- **Flexbox** (adds capability to lay out children in a flexible box layout model)
		- **Table** (adds capability to lay out children in cohesive columns and rows with table behavior)
 
This also means that "aspects" (or any other form of parent/child type restriction for that matter) are no longer necessary. All containers can always host any type of child. Parent and child no longer need to be compatible or aware of each other, since all container behavior is moved to the container, rather than the responsibility being split across the container and the child (as is currently the case with row/column for example).
 
It also means the implementation will be faster; the element tree will be much leaner without the extra nodes introduced by the `Grid` and `Column` elements.
 
It also means the user experience will be much simpler, with less types of elements to keep track of. Just drag any type of element to any container, and position it intuitively. Additionally, the number of container borders/boundaries and the amount of visual padding in the editor will decrease dramatically.

## Some random unorganized notes and questions
 
### What components/parts constitute an element type?

- Model class
- Angular directive
- Template
- Styles
- Scripts
- Other resources (images etc)
 
### How can a module contribute all of the above into the framework?

### How can modules depend on other modules? Use some kind of DI container? Or just AMD?
                          
### What defines an element type?

- Visual appearance (inside the frame, also perhaps the frame itself?)
- Specific actions and their keyboard shortcuts
- Is it a container or not?
- Toolbox category, icon, label and description
- JSON data representation
- Factory logic
- Editable properties
- (Should the element type contribute actual UI, or should it be declarative? Or use some form of  "reflection"?)

### How can the editing experience be done right?

- Editing is provided by the element type, in whatever fashion that makes sense considering the element type and its contents etc.
- Editing is invoked on the element level.
- There is no codified or structural distinction between inline and non-inline editing. It's all just editing, and the visual experience is simply up to the element type.
- When editing is invoked, the host should have an opportunity (through a callback for example) to substitute the editing experience.
                          
### What is common for all element types?

- Common actions and their keyboard shortcuts
- Visual appearence of common chrome (frame)
- Common interactions (active state, selected state, focused state, reordering)
- Clipboard functionality
                          
### What is the interface between an element type and the editor?

- Editor provides a framework for showing element editing UI
- What is the interface between an element instance and the editor?
- What is the interface between different (unknown to each other) element types and element instances?
- What is the interface between the editor and its host?
- Host provides a concrete implementation of the element editing UI container (could be a dialog, could be something else)
 
### Can existing element types be extended? If so, how?

- Host can change the editing experience of an element type via a callback
- Host can change the template URL of an element type
                          
### Can the editor be extended/customized? If so, how?

- Customize look and feel (skinning)
