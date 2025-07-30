# %%
price = 1250000
average_unit_price = 1000000


margin_rate = 0.45


base_salary = 361400+58000


bonus = 720000*2

# %%
annual_salary = base_salary*12+bonus
average_monthly_salary = annual_salary/12
print(f"年収 (Annual Salary): {annual_salary}")
print(f"平均月収 (Average Monthly Salary): {average_monthly_salary}")

# %%
monthly_gain = price*margin_rate
save_bonus = monthly_gain*4
monthly_no_bonus = monthly_gain*8/12
print(monthly_gain)
print(save_bonus)
print(monthly_no_bonus)

# %%
monthly_no_bonus*12+save_bonus

# %%


# %%


# %%
