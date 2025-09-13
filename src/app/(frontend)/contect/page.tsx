import React from 'react'

const formField = [
  { name: 'name', label: 'Name*', placeholder: 'Aqui vai a descrição...', type: 'text' },
  { name: 'company', label: 'Nome da Empresa*', placeholder: 'Nome da Empresa*', type: 'text' },
  { name: 'email', label: 'Email*', placeholder: 'Email*', type: 'email' },
  { name: 'additionalInfo', label: 'Informações Adicionais', placeholder: 'Conte-nos os seus problemas e necessidades', type: 'textarea' }
]

const page = () => {
  return (
    <div className="w-full flex flex-col justify-center items-center px-4 sm:px-6 lg:px-0">
      <div
        style={{ backgroundImage: "url('/assets/images/contectFormBg.png')" }}
        className="contect-page flex flex-col justify-center items-center w-full max-w-[1240px] rounded-[24px] py-[48px] px-[24px] gap-[48px] bg-no-repeat bg-center bg-cover"
      >
        <div className="w-full max-w-[1144px] flex flex-col items-center gap-6">
          <span className="font-normal text-xl sm:text-2xl leading-[150%] tracking-normal text-center block">
            Consultoria Grátis
          </span>
          <span className="w-full sm:w-[776px] text-2xl sm:text-[40px] font-semibold leading-[130%] tracking-normal text-center block">
            Quer saber como utilizar IA para alavancar o seu negócio?
          </span>
          <p className="w-full sm:w-[776px] text-base sm:text-[24px] font-normal leading-[150%] tracking-normal text-center">
            Preencha o formulário e, dentro de 24 horas, a nossa equipa entrará em contacto consigo para agendar uma consolturia grátis.
          </p>
        </div>

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
                      className="text-[#B3B3B3] w-full min-w-[240px] h-[50px] px-[16px] py-[8px] border-b-[2px] border-[#E0E0E0] text-[16px] outline-none bg-transparent resize-none"
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
                    <span className="transform transition-transform duration-300 opacity-0 group-hover:translate-x-2 group-hover:opacity-100">→</span>
                </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
