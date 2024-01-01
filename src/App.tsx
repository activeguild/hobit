import {
  UIProvider,
  Divider,
  Flex,
  Button,
  Text,
  Link,
  InputGroup,
  InputLeftAddon,
  Select,
  SelectItem,
  MultiSelect,
  Input,
} from "@yamada-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FileInput } from "@yamada-ui/file-input";
import { Column, Table } from "@yamada-ui/table";
import { ChangeEventHandler, useState } from "react";
import { createWorker } from "tesseract.js";
import { DeeplLanguages, DeeplResponse, translate } from "./deepl";

const sourceItems: SelectItem[] = [
  { label: "BG - Bulgarian", value: "BG" },
  { label: "CS - Czech", value: "CS" },
  { label: "DA - Danish", value: "DA" },
  { label: "DE - German", value: "DE" },
  { label: "EL - Greek", value: "EL" },
  { label: "EN - English", value: "EN" },
  { label: "ES - Spanish", value: "ES" },
  { label: "ET - Estonian", value: "ET" },
  { label: "FI - Finnish", value: "FI" },
  { label: "FR - French", value: "FR" },
  { label: "HU - Hungarian", value: "HU" },
  { label: "ID - Indonesian", value: "ID" },
  { label: "IT - Italian", value: "IT" },
  { label: "JA - Japanese", value: "JA" },
  { label: "KO - Korean", value: "KO" },
  { label: "LT - Lithuanian", value: "LT" },
  { label: "LV - Latvian", value: "LV" },
  { label: "NB - Norwegian (Bokmål)", value: "NB" },
  { label: "NL - Dutch", value: "NL" },
  { label: "PL - Polish", value: "PL" },
  { label: "PT - Portuguese (all Portuguese varieties mixed)", value: "PT" },
  { label: "RO - Romanian", value: "RO" },
  { label: "RU - Russian", value: "RU" },
  { label: "SK - Slovak", value: "SK" },
  { label: "SL - Slovenian", value: "SL" },
  { label: "SV - Swedish", value: "SV" },
  { label: "TR - Turkish", value: "TR" },
  { label: "UK - Ukrainian", value: "UK" },
  { label: "ZH - Chinese", value: "ZH" },
];

const map = new Map<string, string>([
  ["BG", "bul"],
  ["CS", "ces"],
  ["DA", "dan"],
  ["DE", "deu"],
  ["EL", "ell"],
  ["EN", "eng"],
  ["ES", "spa"],
  ["ET", "est"],
  ["FI", "fin"],
  ["FR", "fra"],
  ["HU", "hun"],
  ["ID", "ind"],
  ["IT", "ita"],
  ["JA", "jpn"],
  ["KO", "kor"],
  ["LT", "lit"],
  ["LV", "lav"],
  ["NB", "nor"],
  ["NL", "nld"],
  ["PL", "pol"],
  ["PT", "por"],
  ["RO", "ron"],
  ["RU", "rus"],
  ["SK", "slk"],
  ["SL", "slv"],
  ["SV", "swe"],
  ["TR", "ukr"],
  ["UK", "ukr"],
  ["ZH", "chi_sim"],
]);

export const App = () => {
  const [sourceLanguage, setSourcelanguage] = useState<DeeplLanguages>("JA");
  const [targetLaungages, setTargetLanguages] = useState<DeeplLanguages[]>([
    "EN",
    "ZH",
    "ID",
  ]);
  const [file, setFile] = useState<File>();
  const [authKey, setAuthKey] = useState<string>();
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [columns, setColumns] = useState<Column<object>[]>([]);
  const isValid =
    !!sourceLanguage &&
    !!targetLaungages &&
    !!authKey &&
    targetLaungages.length > 0 &&
    !!file;

  const handleChangeSourcelanguage = (value: string) => {
    setSourcelanguage(value as DeeplLanguages);
  };
  const handleChangeTargetlanguages = (value: string[]) => {
    setTargetLanguages(value as DeeplLanguages[]);
  };
  const handleChangeFile = (value: File[] | undefined) => {
    if (!value) {
      return;
    }
    setFile(value[0]);
  };
  const handleChangeAuthKey: ChangeEventHandler<HTMLInputElement> = (event) => {
    setAuthKey(event.target.value);
  };

  const handleClick = async () => {
    const worker = await createWorker(map.get(sourceLanguage));
    const buffer = await file?.arrayBuffer();
    const ret = await worker.recognize(buffer);
    const requestWords = ret.data.lines.map((line) =>
      line.text.replace(/\s+/g, "")
    );
    const words = ret.data.lines.map((line) => {
      return {
        [`source - ${sourceLanguage}`]: line.text.replace(/\s+/g, ""),
      };
    });
    const columns = [
      {
        header: `source - ${sourceLanguage}`,
        accessorKey: `source - ${sourceLanguage}`,
      },
    ];

    columns.push(
      ...targetLaungages.map((lang) => ({
        header: `target - ${lang}`,
        accessorKey: `target - ${lang}`,
      }))
    );

    setColumns(columns);

    const responseAll = await Promise.all(
      targetLaungages.map(async (targetLanguage) => {
        const deeplResponse = await translate({
          free_api: true,
          auth_key: authKey!,
          texts: requestWords,
          target_lang: targetLanguage,
        });

        return await deeplResponse.json<DeeplResponse>();
      })
    );

    responseAll.forEach(({ translations }, index) => {
      for (let i = 0; i < translations.length; i++) {
        console.log("index :>> ", index);
        words[i] = {
          ...words[i],
          [`target - ${targetLaungages[index]}`]: translations[i].text,
        };
      }
    });

    setRows(words);
    await worker.terminate();
  };

  return (
    <UIProvider>
      <Flex direction="column" gap="md" padding="16px">
        <Text>
          This tool OCRs uploaded images and translates the read text in
          batches.
        </Text>
        <Flex
          direction="column"
          p="md"
          gap="sm"
          bg="white"
          outline="solid"
          outlineColor="primary"
        >
          <Text>1. Select the image you want to OCR.</Text>
          <InputGroup>
            <InputLeftAddon>
              <FontAwesomeIcon icon={faFile} />
            </InputLeftAddon>
            <FileInput
              placeholder={"Please select an image"}
              accept="image/png,image/jpeg,image/jpg"
              maxWidth={200}
              onChange={handleChangeFile}
            />
          </InputGroup>
          <Text marginTop="24px">
            2. Select the language of the selected image. (
            <Link href="https://www.deepl.com/ja/docs-api/documents/translate-document">
              translate-document
            </Link>
            )
          </Text>
          <Select
            items={sourceItems}
            maxWidth={160}
            defaultValue="JA"
            onChange={handleChangeSourcelanguage}
          />
          <Text marginTop="24px">
            3. Select the language you wish to translate into.(
            <Link href="https://www.deepl.com/ja/docs-api/documents/translate-document">
              translate-document
            </Link>
            )
          </Text>
          <MultiSelect
            items={sourceItems}
            maxWidth={480}
            defaultValue={["EN", "ZH", "ID"]}
            onChange={handleChangeTargetlanguages}
          />

          <Text marginTop="24px">4. Set the Auth key for deepl API.</Text>
          <Input maxWidth={480} onChange={handleChangeAuthKey} />
          <Flex direction="row" gap="sm" marginTop="12px">
            <Button
              colorScheme="primary"
              variant="solid"
              maxWidth={160}
              marginTop="24px"
              disabled={!isValid}
              onClick={handleClick}
            >
              Execute
            </Button>
            <Button
              colorScheme="primary"
              variant="solid"
              maxWidth={160}
              marginTop="24px"
              disabled={!isValid}
              onClick={handleClick}
            >
              Download(csv)
            </Button>
          </Flex>
        </Flex>
        <Divider variant="solid" />
        {rows.length > 0 && <Table columns={columns} data={rows} />}
      </Flex>
    </UIProvider>
  );
};
