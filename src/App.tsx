import {
  UIProvider,
  Divider,
  Flex,
  Button,
  Text,
  Heading,
  Accordion,
  AccordionItem,
  AccordionLabel,
  AccordionPanel,
  Link,
  InputGroup,
  InputLeftAddon,
  Select,
  Option,
  SelectItem,
  MultiSelect,
} from "@yamada-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FileInput } from "@yamada-ui/file-input";
import { Column, Table, RowData } from "@yamada-ui/table";
import { useMemo } from "react";

const sourceLanguages: SelectItem[] = [
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
  const columns = useMemo<Column<RowData>[]>(
    () => [
      {
        header: "作品名",
        accessorKey: "name",
      },
      {
        header: "放送期間",
        accessorKey: "broadcastPeriod",
      },
      {
        header: "話数",
        accessorKey: "episode",
      },
    ],
    []
  );

  const data = useMemo<RowData[]>(
    () => [
      {
        name: "ドラゴンボール",
        broadcastPeriod: "1986年2月26日 - 1989年4月19日",
        episode: "全153話",
      },
      {
        name: "ドラゴンボールZ",
        broadcastPeriod: "1989年4月26日 - 1996年1月31日",
        episode: "全291話 + スペシャル2話",
      },
      {
        name: "ドラゴンボールGT",
        broadcastPeriod: "1996年2月7日 - 1997年11月19日",
        episode: "全64話 + 番外編1話",
      },
      {
        name: "ドラゴンボール改",
        broadcastPeriod: "2009年4月5日 - 2015年6月28日",
        episode: "全159話",
      },
      {
        name: "ドラゴンボール超",
        broadcastPeriod: "2015年7月5日 - 2018年3月25日",
        episode: "全131話",
      },
    ],
    []
  );

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
          {/* <Accordion>
            <AccordionItem label="Usage">
              <Text>1. Select the image you want to OCR.</Text>
              <Text>2. Select the language of the selected image.</Text>
              <Text>3. Select the language you wish to translate into.</Text>
            </AccordionItem>
          </Accordion> */}
          <Text>1. Select the image you want to OCR.</Text>
          <InputGroup>
            <InputLeftAddon>
              <FontAwesomeIcon icon={faFile} />
            </InputLeftAddon>
            <FileInput
              placeholder={"Please select an image"}
              accept="image/png,image/jpeg,image/jpg"
              maxWidth={200}
            />
          </InputGroup>
          <Text marginTop="24px">
            2. Select the language of the selected image. (
            <Link href="https://www.deepl.com/ja/docs-api/documents/translate-document">
              translate-document
            </Link>
            )
          </Text>
          <Select items={sourceLanguages} maxWidth={160} defaultValue="JA" />
          <Text marginTop="24px">
            3. Select the language you wish to translate into.(
            <Link href="https://www.deepl.com/ja/docs-api/documents/translate-document">
              translate-document
            </Link>
            )
          </Text>
          <MultiSelect
            items={sourceLanguages}
            maxWidth={480}
            defaultValue={["EN", "ZH"]}
          />
          <Button
            colorScheme="primary"
            variant="solid"
            maxWidth={160}
            marginTop="24px"
          >
            Execute
          </Button>
        </Flex>
        <Divider variant="solid" />
        <Table columns={columns} data={data} />
      </Flex>
    </UIProvider>
  );
};
