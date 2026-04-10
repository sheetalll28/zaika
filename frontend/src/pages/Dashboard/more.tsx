import cogoToast from "cogo-toast";
import { Suspense } from "react";
import { useParams } from "react-router-dom";
import { Card } from "../../components";
import { UILoader } from "../../components/loaders/index";
import { instance } from "../../config";
import useSWR from "swr";
export const More = () => {
  const params = useParams().id;
  const fetcher = (url: string) => instance.get(url).then((res) => res.data);
  const { data, error } = useSWR("/recipe/" + params, fetcher, {
    suspense: true,
  });

  if (error) {
    console.log(error);
    cogoToast.error(error?.response?.data?.error);
    return null;
  }

  return (
    <Suspense fallback={<UILoader />}>
      <div className="flex items-center justify-center m-auto">
        <Card
          isFull={true}
          id={data?._id}
          title={data?.title}
          image={data?.image?.url}
          ingredients={data?.ingredients}
          note={data?.note}
          description={data?.description}
          email={data?.user?.email}
          avatar="https://plus.unsplash.com/premium_vector-1713201017274-e9e97d783e75?q=80&w=1800&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
      </div>
    </Suspense>
  );
};