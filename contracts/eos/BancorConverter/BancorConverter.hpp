#pragma once

#include <eosiolib/eosio.hpp>
#include <eosiolib/transaction.hpp>
#include <eosiolib/asset.hpp>
#include <eosiolib/symbol.hpp>
#include <eosiolib/singleton.hpp>
#include "../Common/common.hpp"

using namespace eosio;
using std::string;
using std::vector;

// events
#define EMIT_CONVERSION_EVENT(memo, from_contract, from_symbol, to_contract, to_symbol, from_amount, to_amount, fee_amount) \
    START_EVENT("conversion", "1.1") \
    EVENTKV("memo", memo) \
    EVENTKV("from_contract", from_contract) \
    EVENTKV("from_symbol", from_symbol) \
    EVENTKV("to_contract", to_contract) \
    EVENTKV("to_symbol", to_symbol) \
    EVENTKV("amount", from_amount) \
    EVENTKV("return", to_amount) \
    EVENTKVL("conversion_fee", fee_amount) \
    END_EVENT()

#define EMIT_PRICE_DATA_EVENT(smart_supply, reserve_contract, reserve_symbol, reserve_balance, reserve_ratio) \
    START_EVENT("price_data", "1.1") \
    EVENTKV("smart_supply", smart_supply) \
    EVENTKV("reserve_contract", reserve_contract) \
    EVENTKV("reserve_symbol", reserve_symbol) \
    EVENTKV("reserve_balance", reserve_balance) \
    EVENTKVL("reserve_ratio", reserve_ratio) \
    END_EVENT()

CONTRACT BancorConverter : public eosio::contract {
    using contract::contract;
    public:

        TABLE settings_t {
            name     smart_contract;
            asset    smart_currency;
            bool     smart_enabled;
            bool     enabled;
            name     network;
            bool     verify_ram;
            uint64_t max_fee;
            uint64_t fee;
            EOSLIB_SERIALIZE(settings_t, (smart_contract)(smart_currency)(smart_enabled)(enabled)(network)(verify_ram)(max_fee)(fee))
        };

        TABLE reserve_t {
            name     contract;
            asset    currency;
            uint64_t ratio;
            bool     p_enabled;
            uint64_t primary_key() const { return currency.symbol.code().raw(); }
        };

        typedef eosio::singleton<"settings"_n, settings_t> settings;
        typedef eosio::multi_index<"settings"_n, settings_t> dummy_for_abi; // hack until abi generator generates correct name
        typedef eosio::multi_index<"reserves"_n, reserve_t> reserves;

        ACTION init(name smart_contract,
                    asset smart_currency,
                    bool  smart_enabled,
                    bool  enabled,
                    name  network,
                    bool  verify_ram,
                    uint64_t max_fee,
                    uint64_t fee);
        
        ACTION setreserve(name contract,
                          asset    currency,
                          uint64_t ratio,
                          bool     p_enabled);

        void transfer(name from, name to, asset quantity, string memo);

    private:
        void convert(name from, eosio::asset quantity, std::string memo, name code);
        const reserve_t& get_reserve(uint64_t name, const settings_t& settings);

        asset get_balance(name contract, name owner, symbol_code sym);
        uint64_t get_balance_amount(name contract, name owner, symbol_code sym);
        asset get_supply(name contract, symbol_code sym);

        void verify_entry(name account, name currency_contact, eosio::asset currency);
        void verify_min_return(eosio::asset quantity, std::string min_return);

        double calculate_purchase_return(double balance, double deposit_amount, double supply, int64_t ratio);
        double calculate_sale_return(double balance, double sell_amount, double supply, int64_t ratio);
        double quick_convert(double balance, double in, double toBalance);

        float stof(const char* s);
};
