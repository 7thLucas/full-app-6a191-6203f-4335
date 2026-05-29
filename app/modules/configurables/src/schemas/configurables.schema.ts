/* START: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */
export interface FieldSchemaType {
  fieldName?: string;
  type:
    | "string"
    | "number"
    | "boolean"
    | "object"
    | "array"
    | "color"
    | "url"
    | "enum"
    | "datetime"
    | "file"
    | "files";
  required?: boolean;
  label?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
  fields?: FieldSchemaType[];
  item?: FieldSchemaType;
}
/* END: THIS SECTION CODE IS CANNOT BE CHANGED, YOU ONLY READ IT */

export type ConfigurableSchemas = {
  formSchema: FieldSchemaType[];
};



export const configurableSchemas: ConfigurableSchemas = {
  formSchema: [
    {
      fieldName: "appName",
      type: "string",
      required: true,
      label: "App Name",
    },
    {
      fieldName: "tagline",
      type: "string",
      required: false,
      label: "Tagline",
      maxLength: 140,
    },
    {
      fieldName: "promise",
      type: "string",
      required: false,
      label: "Promise (sub-headline)",
      maxLength: 220,
    },
    {
      fieldName: "logoUrl",
      type: "url",
      required: true,
      label: "Logo URL",
    },
    {
      fieldName: "brandColor",
      type: "object",
      required: true,
      label: "Brand Color",
      fields: [
        {
          fieldName: "primary",
          type: "color",
          required: true,
          label: "Primary",
        },
        {
          fieldName: "secondary",
          type: "color",
          required: true,
          label: "Secondary",
        },
        {
          fieldName: "accent",
          type: "color",
          required: true,
          label: "Accent",
        },
      ],
    },
    {
      fieldName: "surfaceColor",
      type: "object",
      required: false,
      label: "Surface Colors",
      fields: [
        { fieldName: "background", type: "color", required: false, label: "Background" },
        { fieldName: "panel", type: "color", required: false, label: "Panel Surface" },
        { fieldName: "elevated", type: "color", required: false, label: "Elevated Surface" },
        { fieldName: "borderSubtle", type: "color", required: false, label: "Subtle Border" },
        { fieldName: "borderDefault", type: "color", required: false, label: "Default Border" },
      ],
    },
    {
      fieldName: "textColor",
      type: "object",
      required: false,
      label: "Text Colors",
      fields: [
        { fieldName: "primary", type: "color", required: false, label: "Primary Text" },
        { fieldName: "secondary", type: "color", required: false, label: "Secondary Text" },
        { fieldName: "tertiary", type: "color", required: false, label: "Tertiary Text" },
      ],
    },
    {
      fieldName: "flagColor",
      type: "object",
      required: false,
      label: "Flag Colors",
      fields: [
        { fieldName: "emotion", type: "color", required: false, label: "Emotion Peak" },
        { fieldName: "topic", type: "color", required: false, label: "Topic Shift" },
        { fieldName: "quote", type: "color", required: false, label: "Quotable Line" },
      ],
    },
    {
      fieldName: "uploadCopy",
      type: "object",
      required: false,
      label: "Upload Zone Copy",
      fields: [
        { fieldName: "headline", type: "string", required: false, label: "Headline" },
        { fieldName: "hint", type: "string", required: false, label: "Hint" },
        { fieldName: "draggingLabel", type: "string", required: false, label: "Dragging Label" },
        { fieldName: "loadingLabel", type: "string", required: false, label: "Loading Label" },
        { fieldName: "ctaLabel", type: "string", required: false, label: "CTA Button Label" },
      ],
    },
    {
      fieldName: "workbenchCopy",
      type: "object",
      required: false,
      label: "Workbench Copy",
      fields: [
        { fieldName: "transcriptTitle", type: "string", required: false, label: "Transcript Panel Title" },
        { fieldName: "transcriptHint", type: "string", required: false, label: "Transcript Panel Hint" },
        { fieldName: "timelineTitle", type: "string", required: false, label: "Timeline Panel Title" },
        { fieldName: "timelineHint", type: "string", required: false, label: "Timeline Panel Hint" },
        { fieldName: "playerTitle", type: "string", required: false, label: "Player Panel Title" },
        { fieldName: "emptyTranscript", type: "string", required: false, label: "Empty Transcript Message" },
        { fieldName: "emptyFlags", type: "string", required: false, label: "Empty Flags Message" },
        { fieldName: "searchPlaceholder", type: "string", required: false, label: "Transcript Search Placeholder" },
      ],
    },
    {
      fieldName: "footerText",
      type: "string",
      required: false,
      label: "Footer Text",
      maxLength: 200,
    },
    {
      fieldName: "flagLegend",
      type: "array",
      required: false,
      label: "Flag Legend",
      item: {
        type: "object",
        required: true,
        fields: [
          { fieldName: "id", type: "string", required: true, label: "Flag ID (emotion / topic / quote)" },
          { fieldName: "label", type: "string", required: true, label: "Label" },
          { fieldName: "description", type: "string", required: false, label: "Description" },
        ],
      },
    },
  ],
};
