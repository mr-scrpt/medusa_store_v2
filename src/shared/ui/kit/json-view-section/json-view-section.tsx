import {
  ArrowUpRightOnBox,
  Check,
  PencilSquare,
  SquareTwoStack,
  TriangleDownMini,
  XMarkMini,
} from "@medusajs/icons";
import {
  Badge,
  Button,
  Container,
  Drawer,
  Heading,
  IconButton,
  Kbd,
  Textarea,
} from "@medusajs/ui";
import Primitive from "@uiw/react-json-view";
import { CSSProperties, MouseEvent, Suspense, useMemo, useState } from "react";

// --- ИЗМЕНЕНИЯ В ТИПАХ ---
export type JsonViewSectionProps = {
  data: string | null | undefined; // Теперь data - это строка
  title?: string;
  editable?: boolean;
  onSave?: (value: string) => void; // onSave теперь тоже работает со строкой
};

export const JsonViewSection = ({
  data,
  title = "JSON",
  editable = false,
  onSave,
}: JsonViewSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Эта логика преобразует входящую строку в объект для красивого отображения
  const processedData = useMemo(() => {
    if (!data || typeof data !== "string" || data.trim() === "") {
      return {};
    }
    try {
      return JSON.parse(data);
    } catch (error) {
      // Если парсинг не удался, отображаем ошибку или исходную строку
      return { error: "Invalid JSON format", value: data };
    }
  }, [data]);

  // Эта функция готовит строку для редактирования в Textarea
  const getEditableString = () => {
    if (!data) {
      return "";
    }
    try {
      // Пытаемся красиво отформатировать JSON
      const parsed = JSON.parse(data);
      return JSON.stringify(parsed, null, 2);
    } catch {
      // Если это не JSON, возвращаем как есть
      return data;
    }
  };

  const handleStartEdit = () => {
    setEditValue(getEditableString());
    setIsEditing(true);
    setValidationError(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue("");
    setValidationError(null);
  };

  const handleSave = () => {
    try {
      // Проверяем валидность JSON, если строка не пустая
      if (editValue.trim() !== "") {
        JSON.parse(editValue);
      }
      // Если валидация прошла, вызываем onSave с новой строкой
      onSave?.(editValue);
      setIsEditing(false);
      setValidationError(null);
    } catch (error) {
      setValidationError("Invalid JSON format");
    }
  };

  const numberOfKeys = Object.keys(processedData).length;

  return (
    <Container className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-x-4">
        <Heading level="h2">{title}</Heading>
        <Badge size="2xsmall" rounded="full">
          {numberOfKeys} keys
        </Badge>
        {editable && (
          <Badge size="2xsmall" color="green" rounded="full">
            Editable
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-x-2">
        <Drawer>
          <Drawer.Trigger asChild>
            <IconButton
              size="small"
              variant="transparent"
              className="text-ui-fg-muted hover:text-ui-fg-subtle"
            >
              <ArrowUpRightOnBox />
            </IconButton>
          </Drawer.Trigger>
          <Drawer.Content className="bg-ui-contrast-bg-base text-ui-code-fg-subtle !shadow-elevation-commandbar overflow-hidden border border-none max-md:inset-x-2 max-md:max-w-[calc(100%-16px)]">
            <div className="bg-ui-code-bg-base flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-x-4">
                <Drawer.Title asChild>
                  <Heading className="text-ui-contrast-fg-primary">
                    {title}
                  </Heading>
                </Drawer.Title>
                <Badge
                  size="2xsmall"
                  rounded="full"
                  className="text-ui-fg-subtle"
                >
                  <span className="text-ui-fg-subtle">{numberOfKeys} keys</span>
                </Badge>
                {isEditing && (
                  <Badge size="2xsmall" color="orange" rounded="full">
                    Editing
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-x-2">
                {editable && !isEditing && (
                  <IconButton
                    size="small"
                    variant="transparent"
                    className="text-ui-contrast-fg-secondary hover:text-ui-contrast-fg-primary"
                    onClick={handleStartEdit}
                  >
                    <PencilSquare />
                  </IconButton>
                )}
                {isEditing && (
                  <>
                    <Button
                      size="small"
                      variant="secondary"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button size="small" onClick={handleSave}>
                      Save
                    </Button>
                  </>
                )}
                <Kbd className="bg-ui-contrast-bg-subtle border-ui-contrast-border-base text-ui-contrast-fg-secondary">
                  esc
                </Kbd>
                <Drawer.Close asChild>
                  <IconButton
                    size="small"
                    variant="transparent"
                    className="text-ui-contrast-fg-secondary hover:text-ui-contrast-fg-primary hover:bg-ui-contrast-bg-base-hover active:bg-ui-contrast-bg-base-pressed focus-visible:bg-ui-contrast-bg-base-hover focus-visible:shadow-borders-interactive-with-active"
                    onClick={handleCancelEdit}
                  >
                    <XMarkMini />
                  </IconButton>
                </Drawer.Close>
              </div>
            </div>
            <Drawer.Body className="flex flex-1 flex-col overflow-hidden px-[5px] py-0 pb-[5px]">
              <div className="bg-ui-contrast-bg-subtle flex-1 overflow-auto rounded-b-[4px] rounded-t-lg p-3">
                {isEditing ? (
                  <div className="flex flex-col h-full">
                    <Textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 min-h-[300px] font-mono text-sm resize-none"
                      placeholder="Enter valid JSON..."
                    />
                    {validationError && (
                      <div className="mt-2 text-ui-tag-red-text text-sm">
                        {validationError}
                      </div>
                    )}
                    <div className="mt-3 flex justify-end gap-x-2">
                      <Button
                        size="small"
                        variant="secondary"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button size="small" onClick={handleSave}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Suspense
                    fallback={<div className="flex size-full flex-col"></div>}
                  >
                    <div className="relative">
                      {editable && (
                        <div className="absolute top-2 right-2 z-10">
                          <IconButton
                            size="small"
                            variant="transparent"
                            className="bg-ui-contrast-bg-base hover:bg-ui-contrast-bg-base-hover text-ui-contrast-fg-secondary hover:text-ui-contrast-fg-primary"
                            onClick={handleStartEdit}
                          >
                            <PencilSquare />
                          </IconButton>
                        </div>
                      )}
                      <Primitive
                        value={processedData}
                        displayDataTypes={false}
                        style={
                          {
                            "--w-rjv-font-family": "Roboto Mono, monospace",
                            "--w-rjv-line-color": "var(--contrast-border-base)",
                            "--w-rjv-curlybraces-color":
                              "var(--contrast-fg-secondary)",
                            "--w-rjv-brackets-color":
                              "var(--contrast-fg-secondary)",
                            "--w-rjv-key-string": "var(--contrast-fg-primary)",
                            "--w-rjv-info-color":
                              "var(--contrast-fg-secondary)",
                            "--w-rjv-type-string-color":
                              "var(--tag-green-icon)",
                            "--w-rjv-quotes-string-color":
                              "var(--tag-green-icon)",
                            "--w-rjv-type-boolean-color":
                              "var(--tag-orange-icon)",
                            "--w-rjv-type-int-color": "var(--tag-orange-icon)",
                            "--w-rjv-type-float-color":
                              "var(--tag-orange-icon)",
                            "--w-rjv-type-bigint-color":
                              "var(--tag-orange-icon)",
                            "--w-rjv-key-number":
                              "var(--contrast-fg-secondary)",
                            "--w-rjv-arrow-color":
                              "var(--contrast-fg-secondary)",
                            "--w-rjv-copied-color":
                              "var(--contrast-fg-secondary)",
                            "--w-rjv-copied-success-color":
                              "var(--contrast-fg-primary)",
                            "--w-rjv-colon-color": "var(--contrast-fg-primary)",
                            "--w-rjv-ellipsis-color":
                              "var(--contrast-fg-secondary)",
                          } as CSSProperties
                        }
                        collapsed={1}
                      >
                        <Primitive.Quote render={() => <span />} />
                        <Primitive.Null
                          render={() => (
                            <span className="text-ui-tag-red-icon">null</span>
                          )}
                        />
                        <Primitive.Undefined
                          render={() => (
                            <span className="text-ui-tag-blue-icon">
                              undefined
                            </span>
                          )}
                        />
                        <Primitive.CountInfo
                          render={(_props, { value }) => {
                            return (
                              <span className="text-ui-contrast-fg-secondary ml-2">
                                {Object.keys(value as object).length} items
                              </span>
                            );
                          }}
                        />
                        <Primitive.Arrow>
                          <TriangleDownMini className="text-ui-contrast-fg-secondary -ml-[0.5px]" />
                        </Primitive.Arrow>
                        <Primitive.Colon>
                          <span className="mr-1">:</span>
                        </Primitive.Colon>
                        <Primitive.Copied
                          render={({ style }, { value }) => {
                            return <Copied style={style} value={value} />;
                          }}
                        />
                      </Primitive>
                    </div>
                  </Suspense>
                )}
              </div>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </div>
    </Container>
  );
};

type CopiedProps = {
  style?: CSSProperties;
  value: object | undefined;
};

const Copied = ({ style, value }: CopiedProps) => {
  const [copied, setCopied] = useState(false);

  const handler = (e: MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setCopied(true);
    if (typeof value === "string") {
      navigator.clipboard.writeText(value);
    } else {
      const json = JSON.stringify(value, null, 2);
      navigator.clipboard.writeText(json);
    }
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const styl = { whiteSpace: "nowrap", width: "20px" } as CSSProperties;

  if (copied) {
    return (
      <span style={{ ...style, ...styl }}>
        <Check className="text-ui-contrast-fg-primary" />
      </span>
    );
  }

  return (
    <span style={{ ...style, ...styl }} onClick={handler}>
      <SquareTwoStack className="text-ui-contrast-fg-secondary" />
    </span>
  );
};
