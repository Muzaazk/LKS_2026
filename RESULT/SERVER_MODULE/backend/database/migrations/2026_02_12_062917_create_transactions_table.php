<?php

use Carbon\Traits\Timestamp;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_code')->unique();
            $table->dateTime('transaction_date');
            $table->decimal('total_amount', 16,2);
            $table->string('payment_method')->nullable();
            $table->timestamps();
        });

        Schema::create('transaction_details', function (Blueprint $table) {
            $table->id();
            $table->integer('quantity');
            $table->decimal('price', 15,2);
            $table->decimal('subtotal', 15,2);
            $table->timestamps();
            $table->foreignId('transaction_id')
                  ->references('id')
                  ->on('transactions')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
            $table->foreignId('product_id')
                  ->references('id')
                  ->on('products')
                  ->onDelete('cascade')
                  ->onUpdate('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
