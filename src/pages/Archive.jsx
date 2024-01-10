import { Note } from "../components/Note";
import { TimeSort } from "../components/TimeSort";
import { useEffect } from "react";
import { getAllArchiveAPI } from "../services/allAPIs";
import { useSelector, useDispatch } from "react-redux";
import { addArchivesToStore } from "../redux/addArchiveSlice";

const Archive = () => {
  const { archives } = useSelector((state) => state.archive);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllArchive();
  }, []);

  const getAllArchive = async () => {
    const { data } = await getAllArchiveAPI();
    dispatch(addArchivesToStore(data));
  };

  return (
    <div className=" container flex flex-col items-center lg:items-start px-2 py-4 mt-5">
      <h1 className="text-5xl">Archive</h1>
      <TimeSort />
      <div className="my-10 columns-1 gap-8 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5">
        {archives?.map((item, index) => (
          <div key={index}>
            <Note archive={true} data={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Archive;
