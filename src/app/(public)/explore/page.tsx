import ExploreClient from "./ExploreClient";

export default async function ExploreServerPage(props: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const params = await props.searchParams;
  return (
    <ExploreClient
      initialQuery={params.q || ""}
      initialCategory={params.cat || "all"}
    />
  );
}
