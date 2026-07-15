import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const SearchTabs = ({ tab, setTab }) => {
  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="mx-3 mt-2.5 mb-1 h-9 w-fit rounded-full bg-muted/70 p-1">
        <TabsTrigger
          value="chats"
          className="rounded-full px-4 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
        >
          Chats
        </TabsTrigger>

        <TabsTrigger
          value="documents"
          className="rounded-full px-4 text-xs font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
        >
          Documents
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default SearchTabs;