import { Form } from '@payloadcms/plugin-form-builder/types'

const formField = [
  { name: 'name', label: 'Name*', placeholder: 'Aqui vai a descrição...', type: 'text' },
  { name: 'company', label: 'Nome da Empresa*', placeholder: 'Nome da Empresa*', type: 'text' },
  { name: 'email', label: 'Email*', placeholder: 'Email*', type: 'email' },
  {
    name: 'additionalInfo',
    label: 'Informações Adicionais',
    placeholder: 'Conte-nos os seus problemas e necessidades',
    type: 'textarea',
  },
]

export const ContectForm = ({ form }: { form: string | Form }) => {
  console.log(form)
  return (
    <div className="w-full max-w-[694px] flex justify-center items-center gap-8 flex-col sm:flex-row rounded-[24px] p-6 sm:p-8 bg-[#EDEDED]">
      <div className="w-full sm:w-[646px] flex flex-col gap-6">
        <form className="w-full h-full min-w-[240px] flex flex-col gap-6 sm:gap-[24px] rounded-[12px] p-4">
          {formField.map((field, index) => (
            <div key={index} className="w-full flex flex-col gap-2">
              <label className="font-ClashDisplayVariable font-normal text-[#1E1E1E] text-base sm:text-base leading-[140%] tracking-normal">
                {field.label}
              </label>
              <p className="description font-sans font-normal text-base leading-[140%] tracking-normal"></p>
              {field.type === 'textarea' ? (
                <textarea
                  placeholder={field.placeholder}
                  className="text-[#B3B3B3] w-full min-w-[240px] h-[50px] px-[16px] py-[8px] border-b-[2px] border-[#E0E0E0] text-[16px] outline-none bg-transparent resize-none overflow-hidden"
                />
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="text-[#B3B3B3] w-full min-w-[240px] h-[46px] px-[16px] py-[8px] border-b-[2px] border-[#E0E0E0] text-[16px] outline-none bg-transparent"
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full h-[52px] px-[20px] py-[16px] rounded-[24px] border-2 border-[#E0E0E0] flex items-center justify-center text-[#030531] text-[20px] bg-white transition-all duration-300 hover:border-[#4ECDC4] group hover:shadow-[inset_0_0_8px_rgba(78,205,196,0.4)] hover:shadow-[inset_0_0_12px_rgba(78,205,196,0.6)]"
          >
            <span className="group-hover:mr-2 transition-all duration-300">Submeter</span>
            <span className="transform transition-transform duration-300 opacity-0 group-hover:translate-x-2 group-hover:opacity-100">
              →
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}
