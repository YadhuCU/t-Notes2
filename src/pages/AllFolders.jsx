import { Folder } from "../components/Folder";
import { TimeSort } from "../components/TimeSort";
import { useSelector } from "react-redux";

const AllFolders = () => {
  const { folders } = useSelector((state) => state.folder);

  return (
    <div className=" container px-2 py-4 mt-5 flex flex-col items-center lg:items-start">
      <h1 className="text-5xl">All Folders</h1>
      <TimeSort />
      <div className="my-10 gap-8 flex flex-wrap justify-center lg:justify-start">
        {folders?.map((item, index) => (
          <Folder key={index} folder={item} home={false} />
        ))}
      </div>
    </div>
  );
};

export default AllFolders;
