def lcp_of_two_suffixes(s:str, i:int, j:int, prev_lcp:int):
    lcp = max(0, prev_lcp)
    while i + lcp < len(s) and j + lcp < len(s):
        if s[i + lcp] == s[j + lcp]:
            lcp += 1
        else:
            break

    return lcp

def build_lcp_arr(s, suffix_arr):
    lcp_arr = [0] * (len(s) - 1)
    inverse_suffix_arr = [0] * len(suffix_arr)
    for i, v in enumerate(suffix_arr):
        inverse_suffix_arr[v] = i

    lcp = 0
    suffix = suffix_arr[0]

    for i in range(len(s)):
        order_index = inverse_suffix_arr[suffix]
        if order_index == len(s) - 1:
            lcp = 0
            suffix = (suffix + 1) % len(s)
            continue

        next_suffix = suffix_arr[order_index + 1]
        lcp = lcp_of_two_suffixes(s, suffix, next_suffix, lcp - 1)
        lcp_arr[order_index] = lcp
        suffix = (suffix + 1) % len(s)

    return lcp_arr

print(build_lcp_arr('helloworld', [
  9, 1, 0, 8, 2,
  3, 6, 4, 7, 5
]))