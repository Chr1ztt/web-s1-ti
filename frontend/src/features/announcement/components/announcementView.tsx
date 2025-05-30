import { EditorContent } from "@tiptap/react";
import { Announcement } from "../types/announcement.type";
import useMinimalTiptapEditor from "@/components/ui/custom/minimal-tiptap/hooks/use-minimal-tiptap";
import { ENV } from "@/env";
import { useState } from "react";

const AnnouncementView = ({ data }: { data: Announcement }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const editor = useMinimalTiptapEditor({
    value: data.isi,
    editable: false,
  });
  if (!editor) {
    return null;
  }

  const url = data.file?.includes("pengumuman_files")
    ? `${ENV.APP.BACKEND_URL}/files/${data.file}`
    : data.file;

  const openModal = (imageUrl: string) => {
    setModalImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const dateUploaded = new Date(data.created_at);
  const formattedDate = dateUploaded.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto">
      {" "}
      <div className="flex flex-col items-center justify-center w-full mb-6">
        {url && (
          <img
            src={url}
            alt="announcement"
            className="w-full h-96 object-cover object-top rounded-b-lg lg:rounded-lg shadow-lg"
            onClick={() => openModal(url)}
          />
        )}
      </div>
      {isModalOpen && modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={closeModal}
        >
          <div
            className="relative bg-white p-4 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImage}
              alt="full-size"
              className="max-w-full max-h-[80vh] mx-auto"
            />
            <button
              className="absolute top-0 right-0 p-2 text-white bg-black rounded-full"
              onClick={closeModal}
            >
              X
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col justify-center items-center w-full px-2 md:px-4">
        <div className="text-4xl font-bold mb-4 w-full max-w-5xl">
          {data.judul}
        </div>
        <div className="text-sm text-muted-foreground mb-4 w-full max-w-5xl">
          {formattedDate}
        </div>
        <div className="text-sm text-muted-foreground mb-4 w-full max-w-5xl">{`oleh: ${data.user.name}`}</div>
        <div className="w-full max-w-5xl px-4">
          <EditorContent
            editor={editor}
            className="minimal-tiptap-editor space-y-2 text-justify"
          />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementView;
