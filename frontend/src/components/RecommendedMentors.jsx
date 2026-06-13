export default function RecommendedMentors() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-50 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-brand-dark">Recommended Mentors</h3>
        <button className="text-xs font-bold text-indigo-600">View All</button>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-3 group cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-all">
          <img alt="Mentor" className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-indigo-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2cTVghXIpCUxh44GLmQV5TZG7tKeNRa4p_IUXcZhcJgOHYqfR_eqPZMf1XwsMeAw7G93Mp_PzpS6_ix7hCnnrxNLLi6R6QQ6Ie80UOYHor9thatQAuJo7fX_dESwhqyfpHyuq1rfz8OLxHELRdq8BaAaJwGnDcU0zwCmgICyw7ESkMKQGt9wgqGeHPWcA9ixBuZwd1SPThRo9oWIO2FdfiV2QG_SUNqVkhaJs8T5FA8LmfdA41FB7u9WwuUZbpbxlfOPowYN8kZs"/>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-brand-dark truncate">Sara Khan</p>
            <p className="text-[10px] text-gray-400">Data Science</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-bts-gold"><svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> 4.9</div>
        </div>
        <div className="flex items-center gap-3 group cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-all">
          <img alt="Mentor" className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-indigo-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGwwnDm6m5r0C-N0LHiqCBdL2-Nqx8_NqM4iWbojCLkbc_lfkXRoD8ifHqFu_B4YIjC5ptg1deTb7eMqgkoUlSehDIy654yLdySvgNwbY744bsS7-QPDkq8VkubMIslVtgfCIN5VL-RCiGgf7ePrgYIfCFwJGsiNocFZZ5Z_twCj6Fpa0p_1lO7g3d7TBFB_N83r1viTB_zGTY-y9EGraWh8F1Y-_qTQrA1O1izM2LvzBfBgXZ36Y67pgHQLmfW-TzCjpN9MLE9OU"/>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-brand-dark truncate">Omar Aziz</p>
            <p className="text-[10px] text-gray-400">Web Dev</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-bts-gold"><svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> 4.8</div>
        </div>
        <div className="flex items-center gap-3 group cursor-pointer p-2 rounded-xl hover:bg-gray-50 transition-all">
          <img alt="Mentor" className="w-12 h-12 rounded-full border-2 border-transparent group-hover:border-indigo-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2cTVghXIpCUxh44GLmQV5TZG7tKeNRa4p_IUXcZhcJgOHYqfR_eqPZMf1XwsMeAw7G93Mp_PzpS6_ix7hCnnrxNLLi6R6QQ6Ie80UOYHor9thatQAuJo7fX_dESwhqyfpHyuq1rfz8OLxHELRdq8BaAaJwGnDcU0zwCmgICyw7ESkMKQGt9wgqGeHPWcA9ixBuZwd1SPThRo9oWIO2FdfiV2QG_SUNqVkhaJs8T5FA8LmfdA41FB7u9WwuUZbpbxlfOPowYN8kZs"/>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-bold text-brand-dark truncate">Maya Salim</p>
            <p className="text-[10px] text-gray-400">UI/UX Design</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-bts-gold"><svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> 4.9</div>
        </div>
      </div>
    </div>
  );
}
