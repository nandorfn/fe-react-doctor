// Packages
import { useState } from "react"
import { useLocation } from "react-router-dom"

// Utils & Custom hooks
import useForm from "../../hooks/useForm"
import { useGetQuery } from "../../hooks/useGetQuery"
import { validateExtImage } from "../../utils/validation"

// Components
import { Editor } from "../../components/Editor"
import { Input } from "../../components/ui/Form"
import { EditButtonImage } from "./CreateArticle";
import { Button } from "../../components/ui/Button"
import { ErrorMsg } from "../../components/Error/ErrorMsg"

// Assets
import penIcon from '../../assets/icon/filled-pen.svg';
import './Article.css'
import { handleEditArticle } from "../../services/article-service"
import { Transparent } from "../../components/ui/Container"
import { ErrorStatus } from "../../components/Error/ErrorStatus"
const initialError = {
  title: '',
  image: '',
  content: '',
}

export const EditArticle = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idArticle = searchParams.get('id');
  const {
    data,
    isPending,
    isError,
    refetch
  } = useGetQuery('articleEdit', `/doctors/articles/${idArticle}`);

  if (isPending) {
    return (
      <Transparent disabled={true}>
        <div className="spinner-border position-absolute start-50 z-3 top-50" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Transparent>
    )
  }
  
  if (isError) {
    return(
      <div className=" position-absolute start-50 top-50">
        <div style={{ width: 'fit-content'}}>
        <ErrorStatus title={'Gagal memuat data artikel'} action={refetch} />
        </div>
      </div>
    )
  }
  
  return (
    <EditorArticle data={data} />
  )
}


const EditorArticle = ({ data }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const idArticle = searchParams.get('id');

  const initialState = {
    title: data?.results?.title,
    image: data?.results?.image,
    tempImage: data?.results?.image,
    clickImg: false,
  };

  const {
    form,
    setForm,
    error,
    setError,
    handleInput,
  } = useForm(initialState, initialError);
  const [content, setContent] = useState(data?.results?.content || '');

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!validateExtImage(file)) {
        setError({
          ...error,
          image: 'Hanya file dengan ekstensi .jpg, .jpeg, dan .png yang diperbolehkan.'
        });
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataURL = e.target.result;
          setForm({
            ...form,
            image: file,
            tempImage: dataURL,
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handlePost = async () => {
    handleEditArticle(form, content, idArticle, setError)
  }

  const handleImage = () => {
    setForm((prev) => ({
      ...form,
      clickImg: !prev.clickImg
    }))
  }

  return (
    <>
      <div className="px-4 d-flex flex-column gap-4 mt-3">
        <div>
          <div className="d-flex flex-row justify-content-between gap-3">
            <Input
              placeHolder={'Judul'}
              name={'title'}
              type={'text'}
              maxLength={50}
              style={{ maxWidth: '90%' }}
              className={'border-start-0 border-top-0 border-end-0'}
              handleChange={(e) => handleInput(e)}
              value={form.title || data?.results?.title}
            />
            <Button
              onClick={handlePost}
              className={'btn-primary text-white'}>
              Posting
            </Button>
          </div>
          {error.title && <ErrorMsg msg={error.title} />}
        </div>

        <div className="mx-auto">
          {form.tempImage === null
            ?
            <>
              <div className="text-center">
                <input
                  id="file"
                  name="file"
                  type="file"
                  className={`inputfile form-control`}
                  onChange={(e) => handleFileInputChange(e)}
                />
                <label htmlFor="file">Upload Foto</label>
              </div>
              {error.image && <ErrorMsg msg={error.image} />}
            </>
            : <div className=" position-relative mb-3">
              <img
                width={211}
                height={200}
                src={form.tempImage || data?.results?.image}
                onClick={handleImage}
                className={form.clickImg
                  ? 'object-fit-cover opacity-75'
                  : 'object-fit-cover'
                }
                alt="temp image" />
              {form.clickImg &&
                <>
                  <img
                    src={penIcon}
                    width={24}
                    className="article-edit-icon"
                    alt="Edit" />
                  <EditButtonImage
                    tempImage={form.tempImage}
                    handleFileInputChange={handleFileInputChange}
                    setForm={setForm} />
                </>
              }
            </div>
          }
        </div>

        <div className="mb-5">
          {error.content && <ErrorMsg msg={error.content} />}
          <Editor content={content || data?.results?.content} setContent={setContent} />
        </div>
      </div>
    </>
  )
}